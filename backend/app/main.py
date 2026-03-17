from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import auth, complaints, admin, chatbot
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="College Complaint Management System API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api")
app.include_router(complaints.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(chatbot.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to College Complaint Management System API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
