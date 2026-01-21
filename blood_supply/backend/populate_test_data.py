#!/usr/bin/env python
"""
Script to populate test data into Blood Supply Chain database
Run this after migrations: python manage.py migrate

Usage:
    python manage.py shell < populate_test_data.py
    
Or:
    python populate_test_data.py
"""

import os
import django
from datetime import date, timedelta
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bloodchain.settings')
django.setup()

from django.contrib.auth import get_user_model
from accounts.models import DonorHealthInfo
from inventory.models import BloodType, BloodRequest

User = get_user_model()

def clear_test_data():
    """Clear existing test data (optional)"""
    print("Clearing existing test data...")
    User.objects.filter(username__in=[
        'john_donor', 'priya_donor', 'rajesh_donor',
        'central_bank', 'redcross_bank',
        'metro_hospital', 'care_hospital'
    ]).delete()
    print("✓ Test data cleared\n")

def create_donors():
    """Create test donor accounts"""
    print("Creating Donor accounts...")
    
    donors_data = [
        {
            'username': 'john_donor',
            'email': 'john@example.com',
            'password': 'DonorPass123!@',
            'first_name': 'John',
            'last_name': 'Donor',
            'phone': '9876543210',
            'blood_group': 'O+',
            'address': '123 Medical St',
            'city': 'Mumbai',
            'state': 'Maharashtra',
            'country': 'India',
            'pincode': '400001',
            'latitude': Decimal('19.0760'),
            'longitude': Decimal('72.8777'),
            'date_of_birth': date(1990, 5, 15),
            'last_donation_date': date.today() - timedelta(days=80),
            'is_available': True,
        },
        {
            'username': 'priya_donor',
            'email': 'priya@example.com',
            'password': 'DonorPass123!@',
            'first_name': 'Priya',
            'last_name': 'Sharma',
            'phone': '9876543211',
            'blood_group': 'AB-',
            'address': '456 Health Ave',
            'city': 'Delhi',
            'state': 'Delhi',
            'country': 'India',
            'pincode': '110001',
            'latitude': Decimal('28.7041'),
            'longitude': Decimal('77.1025'),
            'date_of_birth': date(1992, 3, 22),
            'last_donation_date': date.today() - timedelta(days=30),
            'is_available': True,
        },
        {
            'username': 'rajesh_donor',
            'email': 'rajesh@example.com',
            'password': 'DonorPass123!@',
            'first_name': 'Rajesh',
            'last_name': 'Kumar',
            'phone': '9876543212',
            'blood_group': 'B+',
            'address': '789 Care Rd',
            'city': 'Bangalore',
            'state': 'Karnataka',
            'country': 'India',
            'pincode': '560001',
            'latitude': Decimal('12.9716'),
            'longitude': Decimal('77.5946'),
            'date_of_birth': date(1988, 8, 10),
            'last_donation_date': None,
            'is_available': True,
        }
    ]
    
    created_donors = []
    for donor_data in donors_data:
        # Check if donor already exists by username
        if User.objects.filter(username=donor_data['username']).exists():
            print(f"⊘ Donor already exists: {donor_data['username']}")
            created_donors.append(User.objects.get(username=donor_data['username']))
            continue
            
        password = donor_data.pop('password')
        donor = User.objects.create_user(
            user_type='DONOR',
            **donor_data
        )
        donor.set_password(password)
        donor.save()
        created_donors.append(donor)
        print(f"✓ Created Donor: {donor.username} ({donor.blood_group})")
    
    return created_donors

def create_blood_banks():
    """Create test blood bank accounts"""
    print("\nCreating Blood Bank accounts...")
    
    banks_data = [
        {
            'username': 'central_bank',
            'email': 'central@bloodbank.com',
            'password': 'BankPass123!@',
            'first_name': 'Central',
            'last_name': 'Bank',
            'phone': '9800000001',
            'blood_bank_name': 'Central Blood Bank',
            'blood_bank_license': 'BB/2024/001',
            'address': '100 Hospital Complex',
            'city': 'Mumbai',
            'state': 'Maharashtra',
            'country': 'India',
            'pincode': '400001',
            'latitude': Decimal('19.0760'),
            'longitude': Decimal('72.8777'),
            'is_verified': True,
        },
        {
            'username': 'redcross_bank',
            'email': 'redcross@bloodbank.com',
            'password': 'BankPass123!@',
            'first_name': 'Red',
            'last_name': 'Cross',
            'phone': '9800000002',
            'blood_bank_name': 'Red Cross Blood Bank',
            'blood_bank_license': 'BB/2024/002',
            'address': '200 Care Center',
            'city': 'Delhi',
            'state': 'Delhi',
            'country': 'India',
            'pincode': '110001',
            'latitude': Decimal('28.7041'),
            'longitude': Decimal('77.1025'),
            'is_verified': True,
        }
    ]
    
    created_banks = []
    for bank_data in banks_data:
        # Check if bank already exists by username
        if User.objects.filter(username=bank_data['username']).exists():
            print(f"⊘ Blood Bank already exists: {bank_data['username']}")
            created_banks.append(User.objects.get(username=bank_data['username']))
            continue
            
        password = bank_data.pop('password')
        bank = User.objects.create_user(
            user_type='BLOOD_BANK',
            **bank_data
        )
        bank.set_password(password)
        bank.save()
        created_banks.append(bank)
        print(f"✓ Created Blood Bank: {bank.blood_bank_name}")
    
    return created_banks

def create_hospitals():
    """Create test hospital accounts"""
    print("\nCreating Hospital accounts...")
    
    hospitals_data = [
        {
            'username': 'metro_hospital',
            'email': 'metro@hospital.com',
            'password': 'HospitalPass123!@',
            'first_name': 'Metro',
            'last_name': 'Hospital',
            'phone': '9855555001',
            'hospital_name': 'Metro Hospital',
            'license_number': 'HOS/2024/001',
            'has_blood_bank': True,
            'address': '300 Medical District',
            'city': 'Mumbai',
            'state': 'Maharashtra',
            'country': 'India',
            'pincode': '400001',
            'latitude': Decimal('19.0760'),
            'longitude': Decimal('72.8777'),
            'is_verified': True,
        },
        {
            'username': 'care_hospital',
            'email': 'care@hospital.com',
            'password': 'HospitalPass123!@',
            'first_name': 'Care',
            'last_name': 'Hospital',
            'phone': '9855555002',
            'hospital_name': 'Care Hospital',
            'license_number': 'HOS/2024/002',
            'has_blood_bank': False,
            'address': '400 Healing Lane',
            'city': 'Bangalore',
            'state': 'Karnataka',
            'country': 'India',
            'pincode': '560001',
            'latitude': Decimal('12.9716'),
            'longitude': Decimal('77.5946'),
            'is_verified': True,
        }
    ]
    
    created_hospitals = []
    for hospital_data in hospitals_data:
        # Check if hospital already exists by username
        if User.objects.filter(username=hospital_data['username']).exists():
            print(f"⊘ Hospital already exists: {hospital_data['username']}")
            created_hospitals.append(User.objects.get(username=hospital_data['username']))
            continue
            
        password = hospital_data.pop('password')
        hospital = User.objects.create_user(
            user_type='HOSPITAL',
            **hospital_data
        )
        hospital.set_password(password)
        hospital.save()
        created_hospitals.append(hospital)
        print(f"✓ Created Hospital: {hospital.hospital_name}")
    
    return created_hospitals

def create_donor_health_info(donors):
    """Create health information for donors"""
    print("\nCreating Donor Health Information...")
    
    health_info_data = [
        {
            'donor': donors[0],  # john_donor
            'height': 180.0,
            'weight': 75.0,
            'blood_pressure': '120/80',
            'hemoglobin_level': 15.5,
            'last_checkup_date': date.today() - timedelta(days=5),
            'is_smoker': False,
            'is_alcoholic': False,
            'diseases': '',
            'medications': '',
        },
        {
            'donor': donors[1],  # priya_donor
            'height': 165.0,
            'weight': 60.0,
            'blood_pressure': '118/76',
            'hemoglobin_level': 14.2,
            'last_checkup_date': date.today() - timedelta(days=10),
            'is_smoker': False,
            'is_alcoholic': False,
            'diseases': '',
            'medications': '',
        },
        {
            'donor': donors[2],  # rajesh_donor
            'height': 175.0,
            'weight': 82.0,
            'blood_pressure': '122/82',
            'hemoglobin_level': 14.8,
            'last_checkup_date': date.today() - timedelta(days=15),
            'is_smoker': False,
            'is_alcoholic': False,
            'diseases': '',
            'medications': '',
        }
    ]
    
    for info_data in health_info_data:
        donor = info_data['donor']
        DonorHealthInfo.objects.get_or_create(
            donor=donor,
            defaults=info_data
        )
        print(f"✓ Created health info for: {donor.username}")

def create_blood_inventory(banks, donors):
    """Create blood inventory for blood banks"""
    print("\nCreating Blood Inventory...")
    
    inventory_data = [
        {
            'blood_group': 'O+',
            'component_type': 'WHOLE_BLOOD',
            'quantity': 50,
            'collection_date': date.today() - timedelta(days=5),
            'expiry_date': date.today() + timedelta(days=10),
            'storage_temperature': 4.0,
            'storage_location': 'Refrigerator A - Shelf 1',
            'batch_number': 'BB001-OPN-20260115-001',
            'status': 'AVAILABLE',
            'blood_bank': banks[0],
            'donor': donors[0],
            'is_tested': True,
            'test_date': date.today() - timedelta(days=4),
        },
        {
            'blood_group': 'AB-',
            'component_type': 'PLASMA',
            'quantity': 30,
            'collection_date': date.today() - timedelta(days=3),
            'expiry_date': date.today() + timedelta(days=85),
            'storage_temperature': -20.0,
            'storage_location': 'Freezer C - Rack 2',
            'batch_number': 'BB001-ABM-20260118-002',
            'status': 'AVAILABLE',
            'blood_bank': banks[0],
            'donor': donors[1],
            'is_tested': True,
            'test_date': date.today() - timedelta(days=2),
        },
        {
            'blood_group': 'B+',
            'component_type': 'RBC',
            'quantity': 25,
            'collection_date': date.today() - timedelta(days=10),
            'expiry_date': date.today() + timedelta(days=5),
            'storage_temperature': 4.0,
            'storage_location': 'Refrigerator B - Shelf 3',
            'batch_number': 'BB002-BPN-20260110-003',
            'status': 'TESTING',
            'blood_bank': banks[1],
            'donor': donors[2],
            'is_tested': False,
        },
        {
            'blood_group': 'A+',
            'component_type': 'PLATELETS',
            'quantity': 40,
            'collection_date': date.today() - timedelta(days=1),
            'expiry_date': date.today() + timedelta(days=6),
            'storage_temperature': 22.0,
            'storage_location': 'Agitator A - Slot 1',
            'batch_number': 'BB002-APN-20260120-004',
            'status': 'AVAILABLE',
            'blood_bank': banks[1],
            'donor': None,
            'is_tested': True,
            'test_date': date.today(),
        },
        {
            'blood_group': 'O-',
            'component_type': 'WHOLE_BLOOD',
            'quantity': 20,
            'collection_date': date.today() - timedelta(days=7),
            'expiry_date': date.today() + timedelta(days=8),
            'storage_temperature': 4.0,
            'storage_location': 'Refrigerator A - Shelf 2',
            'batch_number': 'BB001-OMN-20260114-005',
            'status': 'AVAILABLE',
            'blood_bank': banks[0],
            'donor': None,
            'is_tested': True,
            'test_date': date.today() - timedelta(days=6),
        },
    ]
    
    for inv_data in inventory_data:
        BloodType.objects.get_or_create(
            batch_number=inv_data['batch_number'],
            defaults=inv_data
        )
        print(f"✓ Created inventory: {inv_data['blood_group']} - {inv_data['component_type']} ({inv_data['quantity']} units)")

def create_blood_requests(hospitals):
    """Create blood requests from hospitals"""
    print("\nCreating Blood Requests...")
    
    requests_data = [
        {
            'hospital': hospitals[0],
            'blood_group': 'O+',
            'component_type': 'WHOLE_BLOOD',
            'quantity_required': 10,
            'urgency': 'CRITICAL',
            'patient_details': 'Emergency surgery patient',
            'purpose': 'Emergency Surgery',
            'required_by': date.today() + timedelta(days=1),
            'status': 'PENDING',
        },
        {
            'hospital': hospitals[0],
            'blood_group': 'AB-',
            'component_type': 'PLASMA',
            'quantity_required': 5,
            'urgency': 'HIGH',
            'patient_details': 'Post-operative patient',
            'purpose': 'Post-operative care',
            'required_by': date.today() + timedelta(days=2),
            'status': 'PENDING',
        },
        {
            'hospital': hospitals[1],
            'blood_group': 'B+',
            'component_type': 'WHOLE_BLOOD',
            'quantity_required': 15,
            'urgency': 'MEDIUM',
            'patient_details': 'Routine surgery',
            'purpose': 'Elective Surgery',
            'required_by': date.today() + timedelta(days=3),
            'status': 'PENDING',
        },
        {
            'hospital': hospitals[1],
            'blood_group': 'A+',
            'component_type': 'PLATELETS',
            'quantity_required': 20,
            'urgency': 'LOW',
            'patient_details': 'Chronic patient requiring transfusion',
            'purpose': 'Routine transfusion',
            'required_by': date.today() + timedelta(days=5),
            'status': 'PENDING',
        },
    ]
    
    for req_data in requests_data:
        BloodRequest.objects.get_or_create(
            hospital=req_data['hospital'],
            blood_group=req_data['blood_group'],
            required_by=req_data['required_by'],
            defaults=req_data
        )
        print(f"✓ Created request: {req_data['hospital'].hospital_name} - {req_data['blood_group']} ({req_data['urgency']})")

def main():
    """Main function to populate all test data"""
    print("=" * 60)
    print("Blood Supply Chain - Test Data Population Script")
    print("=" * 60)
    
    try:
        # Uncomment to clear existing test data
        # clear_test_data()
        
        # Create users
        donors = create_donors()
        blood_banks = create_blood_banks()
        hospitals = create_hospitals()
        
        # Create related data
        create_donor_health_info(donors)
        create_blood_inventory(blood_banks, donors)
        create_blood_requests(hospitals)
        
        print("\n" + "=" * 60)
        print("✓ All test data created successfully!")
        print("=" * 60)
        print("\n📋 Test Credentials:")
        print("\n🩸 DONOR Accounts:")
        print("  • john_donor / DonorPass123!@ (O+ Blood)")
        print("  • priya_donor / DonorPass123!@ (AB- Blood)")
        print("  • rajesh_donor / DonorPass123!@ (B+ Blood)")
        print("\n🏥 BLOOD BANK Accounts:")
        print("  • central_bank / BankPass123!@")
        print("  • redcross_bank / BankPass123!@")
        print("\n🏨 HOSPITAL Accounts:")
        print("  • metro_hospital / HospitalPass123!@ (with blood bank)")
        print("  • care_hospital / HospitalPass123!@ (no blood bank)")
        print("\n" + "=" * 60)
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    main()
