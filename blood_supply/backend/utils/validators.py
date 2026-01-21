from django.core.exceptions import ValidationError
import re

def validate_phone_number(value):
    """Validate phone number format"""
    pattern = r'^\+?1?\d{9,15}$'
    if not re.match(pattern, value):
        raise ValidationError('Enter a valid phone number')
    return value

def validate_blood_group(value):
    """Validate blood group format"""
    valid_groups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
    if value not in valid_groups:
        raise ValidationError(f'Blood group must be one of: {", ".join(valid_groups)}')
    return value

def validate_pincode(value):
    """Validate Indian pincode format"""
    pattern = r'^\d{6}$'
    if not re.match(pattern, value):
        raise ValidationError('Enter a valid 6-digit pincode')
    return value