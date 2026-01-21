from datetime import datetime, timedelta
from django.utils import timezone
from math import radians, sin, cos, sqrt, atan2

def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculate distance between two coordinates in kilometers
    using Haversine formula
    """
    R = 6371  # Earth's radius in kilometers
    
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    
    return R * c

def get_expiry_date(collection_date, component_type):
    """
    Calculate expiry date based on component type
    """
    from utils.constants import EXPIRY_PERIODS
    
    expiry_days = EXPIRY_PERIODS.get(component_type, 35)
    return collection_date + timedelta(days=expiry_days)

def is_donation_eligible(last_donation_date, component_type='WHOLE_BLOOD'):
    """
    Check if donor is eligible for donation based on last donation date
    """
    from utils.constants import DONATION_INTERVALS
    
    if not last_donation_date:
        return True
    
    days_since = (timezone.now().date() - last_donation_date).days
    required_interval = DONATION_INTERVALS.get(component_type, 56)
    
    return days_since >= required_interval

def generate_batch_number(blood_bank_id, collection_date):
    """
    Generate unique batch number for blood units
    Format: BB{id}-{date}-{random}
    """
    import random
    import string
    
    date_str = collection_date.strftime('%Y%m%d')
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    
    return f"BB{blood_bank_id:04d}-{date_str}-{random_str}"