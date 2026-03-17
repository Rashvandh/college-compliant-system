import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import os

# Synthetic dataset for training
data = [
    ("The hostel water supply is not working properly", "Hostel Issues", "High"),
    ("The bathroom in block B is very dirty", "Hostel Issues", "Medium"),
    ("Electricity is out in the girls hostel for 3 hours", "Hostel Issues", "High"),
    ("The website login page is failing to load", "IT / Website Issues", "Medium"),
    ("I cannot reset my password on the college portal", "IT / Website Issues", "Medium"),
    ("WiFi is not working in the library", "IT / Website Issues", "Low"),
    ("The professor for Mathematics is not taking classes regularly", "Faculty Issues", "Medium"),
    ("Unfair marking in the internal assessment by the teacher", "Faculty Issues", "High"),
    ("Harassment during the lab session by faculty member", "Faculty Issues", "Critical"),
    ("The classroom projector in room 302 is broken", "Infrastructure Problems", "Medium"),
    ("The benches in the seminar hall are damaged", "Infrastructure Problems", "Low"),
    ("The air conditioning in the computer lab is not working", "Infrastructure Problems", "Medium"),
    ("The bus from downtown is always late", "Transport Issues", "Low"),
    ("Driver is driving recklessly on the highway", "Transport Issues", "High"),
    ("The registration fee is too high this semester", "Fees Issues", "Low"),
    ("Scholarship amount not credited to account yet", "Fees Issues", "Medium"),
    ("Ragging by seniors in the canteen area", "Ragging / Harassment", "Critical"),
    ("Constant bullying in the sports ground", "Ragging / Harassment", "Critical"),
    ("The library does not have the latest edition of AI books", "Library Issues", "Low"),
    ("Exam schedule is overlapping for two subjects", "Examination Issues", "High"),
    ("Results are not published on time", "Examination Issues", "Medium"),
    ("Quality of food in the canteen is very poor", "Other", "Medium")
]

def train_model():
    df = pd.DataFrame(data, columns=['text', 'category', 'priority'])
    
    # Train Category Classifier
    category_pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english')),
        ('clf', LogisticRegression(max_iter=1000))
    ])
    category_pipeline.fit(df['text'], df['category'])
    
    # Train Priority Classifier
    priority_pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english')),
        ('clf', LogisticRegression(max_iter=1000))
    ])
    priority_pipeline.fit(df['text'], df['priority'])
    
    # Ensure models directory exists
    os.makedirs('backend/app/models_data', exist_ok=True)
    
    # Save models
    joblib.dump(category_pipeline, 'backend/app/models_data/category_model.pkl')
    joblib.dump(priority_pipeline, 'backend/app/models_data/priority_model.pkl')
    
    print("Models trained and saved successfully in backend/app/models_data/")

if __name__ == "__main__":
    train_model()
