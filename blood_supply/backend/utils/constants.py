# Blood type constants
BLOOD_GROUPS = [
    'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'
]

BLOOD_COMPONENTS = [
    'WHOLE_BLOOD',
    'RBC',
    'PLASMA',
    'PLATELETS',
    'CRYOPRECIPITATE'
]

# Expiry periods (in days) for different components
EXPIRY_PERIODS = {
    'WHOLE_BLOOD': 35,
    'RBC': 42,
    'PLASMA': 365,  # Frozen plasma
    'PLATELETS': 5,
    'CRYOPRECIPITATE': 365,
}

# Minimum donation intervals (days)
DONATION_INTERVALS = {
    'WHOLE_BLOOD': 56,  # 8 weeks
    'PLASMA': 28,       # 4 weeks
    'PLATELETS': 7,     # 1 week
}

# Emergency priority levels
PRIORITY_LEVELS = {
    'LOW': 1,
    'MEDIUM': 2,
    'HIGH': 3,
    'CRITICAL': 4,
}

# Inventory thresholds
LOW_STOCK_THRESHOLD = 5
CRITICAL_STOCK_THRESHOLD = 2
EXPIRY_WARNING_DAYS = 7