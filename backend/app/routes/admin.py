from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from .. import models, schemas, database
from .auth import get_current_user

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/dashboard", response_model=schemas.DashboardStats)
def get_admin_dashboard(
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    total = db.query(models.Complaint).count()
    pending = db.query(models.Complaint).filter(models.Complaint.status == "Pending").count()
    resolved = db.query(models.Complaint).filter(models.Complaint.status == "Resolved").count()
    
    # Category distribution
    categories = db.query(
        models.Complaint.category, 
        func.count(models.Complaint.id)
    ).group_by(models.Complaint.category).all()
    
    cat_dist = {cat: count for cat, count in categories}
    
    return {
        "total": total,
        "pending": pending,
        "resolved": resolved,
        "category_distribution": cat_dist
    }

@router.put("/complaints/{id}/status", response_model=schemas.ComplaintResponse)
def update_complaint_status(
    id: int, 
    update_data: schemas.ComplaintUpdate, 
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    complaint = db.query(models.Complaint).filter(models.Complaint.id == id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
        
    if update_data.status:
        complaint.status = update_data.status
    if update_data.priority:
        complaint.priority = update_data.priority
        
    db.commit()
    db.refresh(complaint)
    return complaint

@router.get("/users")
def get_all_users(
    db: Session = Depends(database.get_db), 
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    users_with_counts = db.query(models.User, func.count(models.Complaint.id).label("complaints"))\
        .outerjoin(models.Complaint)\
        .group_by(models.User.id)\
        .all()
    
    return [
        {
            "id": str(user.id),
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "department": user.department or "N/A",
            "complaints": count
        }
        for user, count in users_with_counts
    ]
