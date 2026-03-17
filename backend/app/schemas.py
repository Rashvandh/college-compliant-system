from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from .models import Role, Status, Priority

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: Role = Role.STUDENT
    department: Optional[str] = None
    roll_number: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class ComplaintBase(BaseModel):
    title: str
    description: str
    category: Optional[str] = None

class ComplaintCreate(ComplaintBase):
    pass

class ComplaintUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None

class ComplaintResponse(ComplaintBase):
    id: int
    priority: str
    status: str
    student_id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total: int
    pending: int
    resolved: int
    category_distribution: dict
