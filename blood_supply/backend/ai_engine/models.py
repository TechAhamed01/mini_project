import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from django.db import models
from accounts.models import User
from inventory.models import BloodType, BloodRequest
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler

class AIPredictiveModel(models.Model):
    MODEL_TYPES = (
        ('STOCK_PREDICTION', 'Stock Prediction'),
        ('DEMAND_FORECAST', 'Demand Forecast'),
        ('EXPIRY_PREDICTION', 'Expiry Prediction'),
        ('DONOR_MATCHING', 'Donor Matching'),
    )
    
    model_name = models.CharField(max_length=255)
    model_type = models.CharField(max_length=50, choices=MODEL_TYPES)
    model_version = models.CharField(max_length=50)
    accuracy = models.FloatField(default=0.0)
    trained_at = models.DateTimeField(auto_now_add=True)
    model_path = models.CharField(max_length=500, blank=True)
    
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = "AI Model"
        verbose_name_plural = "AI Models"
    
    def __str__(self):
        return f"{self.model_name} v{self.model_version}"

class BloodSupplyChainAI:
    def __init__(self):
        self.scaler = StandardScaler()
        
    def predict_demand(self, location, blood_group, component_type, days_ahead=7):
        """Predict blood demand for specific location and blood type"""
        try:
            # Get historical data
            historical_requests = BloodRequest.objects.filter(
                hospital__city=location['city'],
                blood_group=blood_group,
                component_type=component_type,
                created_at__gte=datetime.now() - timedelta(days=90)
            )
            
            if len(historical_requests) < 10:
                return self._get_default_prediction()
            
            # Prepare data for prediction
            df = pd.DataFrame(list(historical_requests.values(
                'created_at', 'quantity_required', 'urgency'
            )))
            
            # Simple time series prediction (replace with actual ML model)
            daily_avg = df.groupby(df['created_at'].dt.date)['quantity_required'].sum().mean()
            
            # Adjust for seasonality and trends
            prediction = daily_avg * days_ahead
            
            return {
                'predicted_demand': round(prediction, 2),
                'confidence': min(0.95, len(historical_requests) / 100),
                'historical_data_points': len(historical_requests)
            }
            
        except Exception as e:
            print(f"Error in demand prediction: {e}")
            return self._get_default_prediction()
    
    def find_nearest_blood_banks(self, request_location, blood_group, component_type, quantity=1):
        """Find nearest blood banks with required blood type"""
        try:
            # Get all blood banks with required blood type in stock
            available_blood = BloodType.objects.filter(
                blood_group=blood_group,
                component_type=component_type,
                quantity__gte=quantity,
                status='AVAILABLE',
                expiry_date__gt=datetime.now().date()
            ).select_related('blood_bank')
            
            if not available_blood.exists():
                return []
            
            # Prepare location data
            locations = []
            blood_data = []
            
            for blood in available_blood:
                if blood.blood_bank.latitude and blood.blood_bank.longitude:
                    locations.append([
                        float(blood.blood_bank.latitude),
                        float(blood.blood_bank.longitude)
                    ])
                    blood_data.append({
                        'blood_id': blood.id,
                        'blood_bank_id': blood.blood_bank.id,
                        'blood_bank_name': blood.blood_bank.blood_bank_name or blood.blood_bank.username,
                        'quantity': blood.quantity,
                        'expiry_days': blood.days_until_expiry,
                        'address': blood.blood_bank.address,
                        'city': blood.blood_bank.city,
                        'distance': self._calculate_distance(
                            request_location,
                            (blood.blood_bank.latitude, blood.blood_bank.longitude)
                        )
                    })
            
            if not locations:
                return []
            
            # Find nearest neighbors
            locations_array = np.array(locations)
            request_location_array = np.array([[
                float(request_location['latitude']),
                float(request_location['longitude'])
            ]])
            
            # Use KNN to find nearest
            n_neighbors = min(5, len(locations_array))
            knn = NearestNeighbors(n_neighbors=n_neighbors, metric='haversine')
            knn.fit(locations_array)
            
            distances, indices = knn.kneighbors(request_location_array)
            
            # Prepare results
            results = []
            for idx, distance in zip(indices[0], distances[0]):
                blood_info = blood_data[idx]
                blood_info['distance_km'] = round(distance * 111, 2)  # Convert to km
                blood_info['priority_score'] = self._calculate_priority_score(
                    blood_info['distance_km'],
                    blood_info['expiry_days'],
                    blood_info['quantity']
                )
                results.append(blood_info)
            
            return sorted(results, key=lambda x: x['priority_score'], reverse=True)
            
        except Exception as e:
            print(f"Error finding nearest blood banks: {e}")
            return []
    
    def predict_expiry_risk(self, blood_inventory):
        """Predict expiry risk for blood inventory"""
        try:
            expiry_days = blood_inventory.days_until_expiry
            
            if expiry_days <= 0:
                risk = 'EXPIRED'
                confidence = 1.0
            elif expiry_days <= 3:
                risk = 'CRITICAL'
                confidence = 0.95
            elif expiry_days <= 7:
                risk = 'HIGH'
                confidence = 0.85
            elif expiry_days <= 14:
                risk = 'MEDIUM'
                confidence = 0.70
            elif expiry_days <= 30:
                risk = 'LOW'
                confidence = 0.50
            else:
                risk = 'SAFE'
                confidence = 0.30
            
            return {
                'risk_level': risk,
                'confidence': confidence,
                'days_until_expiry': expiry_days,
                'suggested_action': self._get_expiry_action(risk)
            }
            
        except Exception as e:
            print(f"Error predicting expiry risk: {e}")
            return {'risk_level': 'UNKNOWN', 'confidence': 0.0}
    
    def match_donors_for_request(self, blood_request):
        """Find matching donors for a blood request"""
        try:
            donors = User.objects.filter(
                user_type='DONOR',
                blood_group=blood_request.blood_group,
                is_available=True,
                is_verified=True,
                city=blood_request.hospital.city
            )
            
            matched_donors = []
            for donor in donors:
                # Calculate eligibility based on last donation
                if donor.last_donation_date:
                    days_since_last_donation = (datetime.now().date() - donor.last_donation_date).days
                    if days_since_last_donation < 56:  # 8 weeks gap required
                        continue
                
                # Calculate distance
                if (donor.latitude and donor.longitude and 
                    blood_request.hospital.latitude and blood_request.hospital.longitude):
                    distance = self._calculate_distance(
                        {'latitude': donor.latitude, 'longitude': donor.longitude},
                        {'latitude': blood_request.hospital.latitude, 
                         'longitude': blood_request.hospital.longitude}
                    )
                    distance_km = round(distance * 111, 2)
                else:
                    distance_km = None
                
                donor_score = self._calculate_donor_score(donor, distance_km)
                
                if donor_score > 0.3:  # Threshold score
                    matched_donors.append({
                        'donor_id': donor.id,
                        'name': f"{donor.first_name} {donor.last_name}",
                        'phone': donor.phone,
                        'email': donor.email,
                        'distance_km': distance_km,
                        'last_donation': donor.last_donation_date,
                        'availability_score': donor_score
                    })
            
            return sorted(matched_donors, key=lambda x: x['availability_score'], reverse=True)[:10]
            
        except Exception as e:
            print(f"Error matching donors: {e}")
            return []
    
    def _calculate_distance(self, loc1, loc2):
        """Calculate haversine distance between two points"""
        from math import radians, sin, cos, sqrt, atan2
        
        lat1, lon1 = radians(float(loc1['latitude'])), radians(float(loc1['longitude']))
        lat2, lon2 = radians(float(loc2[0])), radians(float(loc2[1]))
        
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * atan2(sqrt(a), sqrt(1-a))
        
        return c
    
    def _calculate_priority_score(self, distance_km, expiry_days, quantity):
        """Calculate priority score for blood availability"""
        distance_score = max(0, 1 - (distance_km / 100))  # 100km max distance
        expiry_score = min(1, expiry_days / 30)  # 30 days max
        quantity_score = min(1, quantity / 10)  # 10 units max
        
        return 0.4 * distance_score + 0.3 * expiry_score + 0.3 * quantity_score
    
    def _calculate_donor_score(self, donor, distance_km=None):
        """Calculate donor availability score"""
        score = 0.0
        
        # Recency of donation
        if donor.last_donation_date:
            days_since = (datetime.now().date() - donor.last_donation_date).days
            recency_score = min(1, days_since / 56)  # 56 days for full recovery
            score += 0.3 * recency_score
        
        # Distance score
        if distance_km is not None:
            distance_score = max(0, 1 - (distance_km / 50))  # 50km max distance
            score += 0.4 * distance_score
        
        # Verification status
        if donor.is_verified:
            score += 0.2
        
        # Health info availability
        if hasattr(donor, 'health_info'):
            score += 0.1
        
        return min(1.0, score)
    
    def _get_expiry_action(self, risk_level):
        actions = {
            'EXPIRED': 'Immediate disposal required',
            'CRITICAL': 'Use immediately or transfer to nearby facilities',
            'HIGH': 'Prioritize usage in next 3 days',
            'MEDIUM': 'Schedule for upcoming requests',
            'LOW': 'Monitor regularly',
            'SAFE': 'Standard inventory'
        }
        return actions.get(risk_level, 'Monitor inventory')
    
    def _get_default_prediction(self):
        return {
            'predicted_demand': 0,
            'confidence': 0.0,
            'historical_data_points': 0
        }