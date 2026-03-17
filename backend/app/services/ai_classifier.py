import joblib
import os
from typing import Tuple

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models_data")
CATEGORY_MODEL_PATH = os.path.join(MODELS_DIR, "category_model.pkl")
PRIORITY_MODEL_PATH = os.path.join(MODELS_DIR, "priority_model.pkl")

class AIClassifier:
    def __init__(self):
        self.category_model = None
        self.priority_model = None
        self.load_models()

    def load_models(self):
        if os.path.exists(CATEGORY_MODEL_PATH) and os.path.exists(PRIORITY_MODEL_PATH):
            self.category_model = joblib.load(CATEGORY_MODEL_PATH)
            self.priority_model = joblib.load(PRIORITY_MODEL_PATH)
            print("AI models loaded successfully.")
        else:
            print(f"AI models not found at {MODELS_DIR}. Please run train_model.py first.")

    def classify(self, text: str) -> Tuple[str, str]:
        if not self.category_model or not self.priority_model:
            # Fallback if models are not loaded
            return "Other", "Low"
        
        category = self.category_model.predict([text])[0]
        priority = self.priority_model.predict([text])[0]
        
        return category, priority

ai_classifier = AIClassifier()
