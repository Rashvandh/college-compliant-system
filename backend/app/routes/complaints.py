from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database
from .auth import get_current_user
from ..services.ai_classifier import ai_classifier

router = APIRouter(prefix="/complaints", tags=["Complaints"])

@router.post("/", response_model=schemas.ComplaintResponse)
def create_complaint(
    complaint: schemas.ComplaintCreate, 
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(get_current_user)
):
    # AI Classification
    category, priority = ai_classifier.classify(complaint.description)
    
    # Override category if provided by user (optional)
    final_category = complaint.category if complaint.category else category
    
    new_complaint = models.Complaint(
        title=complaint.title,
        description=complaint.description,
        category=final_category,
        priority=priority,
        status="Pending",
        student_id=current_user.id
    )
    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)
    return new_complaint

@router.get("/", response_model=List[schemas.ComplaintResponse])
def get_complaints(
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role == "admin":
        return db.query(models.Complaint).all()
    return db.query(models.Complaint).filter(models.Complaint.student_id == current_user.id).all()

@router.get("/{id}", response_model=schemas.ComplaintResponse)
def get_complaint(
    id: int, 
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(get_current_user)
):
    complaint = db.query(models.Complaint).filter(models.Complaint.id == id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    if current_user.role != "admin" and complaint.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return complaint

@router.put("/{id}", response_model=schemas.ComplaintResponse)
def update_complaint(
    id: int, 
    update_data: schemas.ComplaintUpdate, 
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(get_current_user)
):
    complaint = db.query(models.Complaint).filter(models.Complaint.id == id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    if current_user.role != "admin" and complaint.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    if update_data.status:
        complaint.status = update_data.status
    if update_data.priority and current_user.role == "admin":
        complaint.priority = update_data.priority
        
    db.commit()
    db.refresh(complaint)
    return complaint

@router.delete("/{id}")
def delete_complaint(
    id: int, 
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(get_current_user)
):
    complaint = db.query(models.Complaint).filter(models.Complaint.id == id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    if current_user.role != "admin" and complaint.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db.delete(complaint)
    db.commit()
    return {"detail": "Complaint deleted"}
