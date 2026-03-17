from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import os
import json
from groq import Groq

from .. import models, schemas, database
from .auth import get_current_user

router = APIRouter(prefix="/chat", tags=["Chatbot"])

# Initialize Groq client
# This requires GROQ_API_KEY environment variable to be set
try:
    groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
except Exception as e:
    print(f"Failed to initialize Groq client: {e}")
    groq_client = None

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

class ChatResponse(BaseModel):
    reply: str
    complaint_filed: bool
    complaint_data: Optional[dict] = None

SYSTEM_PROMPT = """You are an AI assistant for a College Complaint Management System. 
Your goal is to help students file complaints. 
Be polite, concise, and helpful. 
Ask clarifying questions to gather necessary details:
1. Title of the issue.
2. Detailed description including location (e.g., room number, building).
3. Category (e.g., Infrastructure, Maintenance, Furniture, Plumbing, Academic, Other).
4. Priority (Low, Medium, High, Critical).

If the student hasn't provided enough information, ask for it. 
If you believe you have all the necessary information to file a complaint, you MUST reply with ONLY a JSON block in the following strict format, with no markdown formatting or other text before or after it:
{"action": "file_complaint", "title": "...", "description": "...", "category": "...", "priority": "..."}

Otherwise, reply conversationally as the assistant."""

@router.post("/message", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can use the complaint chatbot.")
        
    if not groq_client:
        return ChatResponse(
            reply="The AI Chatbot is currently unavailable because the Groq API key is not configured.", 
            complaint_filed=False
        )

    # Prepare messages for Groq
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for msg in request.messages:
        messages.append({"role": msg.role, "content": msg.content})

    try:
        response = groq_client.chat.completions.create(
            model="llama3-8b-8192", # Fast and reliable
            messages=messages,
            temperature=0.7,
            max_tokens=500
        )
        
        ai_message = response.choices[0].message.content.strip()
        
        # Check if the AI decided to file a complaint (returned JSON)
        complaint_filed = False
        complaint_data = None
        
        # Simple heuristic: if it starts with { and contains action: file_complaint
        if ai_message.startswith("{") and "file_complaint" in ai_message:
            try:
                data = json.loads(ai_message)
                if data.get("action") == "file_complaint":
                    # File the complaint in the database
                    new_complaint = models.Complaint(
                        title=data.get("title", "AI Generated Complaint"),
                        description=data.get("description", "Filed via Chatbot"),
                        category=data.get("category", "Other"),
                        priority=data.get("priority", "Medium").capitalize(),
                        status="Pending",
                        student_id=current_user.id
                    )
                    db.add(new_complaint)
                    db.commit()
                    db.refresh(new_complaint)
                    
                    complaint_filed = True
                    complaint_data = {
                        "id": new_complaint.id,
                        "title": new_complaint.title
                    }
                    ai_message = f"I've successfully filed your complaint: '{new_complaint.title}'. The reference ID is CC-{str(new_complaint.id).zfill(3)}."
            except json.JSONDecodeError:
                # If JSON parsing fails, just return the raw message
                pass
                
        return ChatResponse(
            reply=ai_message,
            complaint_filed=complaint_filed,
            complaint_data=complaint_data
        )

    except Exception as e:
        print(f"Groq API Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to communicate with AI service.")
