import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib
import os

class DemandForecastModel:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.le_blood_group = LabelEncoder()
        self.le_component = LabelEncoder()
        self.is_trained = False
        
    def prepare_data(self, requests_data):
        """Prepare data for training"""
        df = pd.DataFrame(requests_data)
        
        # Convert dates
        df['created_at'] = pd.to_datetime(df['created_at'])
        df['day_of_week'] = df['created_at'].dt.dayofweek
        df['month'] = df['created_at'].dt.month
        df['day_of_month'] = df['created_at'].dt.day
        
        # Encode categorical variables
        df['blood_group_encoded'] = self.le_blood_group.fit_transform(df['blood_group'])
        df['component_encoded'] = self.le_component.fit_transform(df['component_type'])
        
        return df
    
    def train(self, requests_data):
        """Train the model"""
        df = self.prepare_data(requests_data)
        
        if len(df) < 10:
            return False
        
        # Features and target
        X = df[['blood_group_encoded', 'component_encoded', 'day_of_week', 'month', 'day_of_month']]
        y = df['quantity_required']
        
        self.model.fit(X, y)
        self.is_trained = True
        
        # Save model
        self.save_model()
        return True
    
    def predict(self, blood_group, component_type, date):
        """Make prediction for specific date"""
        if not self.is_trained:
            return None
        
        try:
            # Prepare features
            date_obj = datetime.strptime(date, '%Y-%m-%d')
            features = np.array([[
                self.le_blood_group.transform([blood_group])[0],
                self.le_component.transform([component_type])[0],
                date_obj.weekday(),
                date_obj.month,
                date_obj.day
            ]])
            
            prediction = self.model.predict(features)[0]
            return max(0, round(prediction))
            
        except Exception as e:
            print(f"Prediction error: {e}")
            return None
    
    def save_model(self, path='ai_engine/ml_models/saved_models/'):
        """Save trained model"""
        os.makedirs(path, exist_ok=True)
        joblib.dump({
            'model': self.model,
            'le_blood_group': self.le_blood_group,
            'le_component': self.le_component
        }, os.path.join(path, 'demand_model.joblib'))
    
    def load_model(self, path='ai_engine/ml_models/saved_models/demand_model.joblib'):
        """Load trained model"""
        if os.path.exists(path):
            data = joblib.load(path)
            self.model = data['model']
            self.le_blood_group = data['le_blood_group']
            self.le_component = data['le_component']
            self.is_trained = True
            return True
        return False