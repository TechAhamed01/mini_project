# Test Credentials & Quick Reference

## 🔐 Login Credentials - Copy & Paste Ready

### DONOR ACCOUNTS

#### Donor 1 - O+ Blood Type (ELIGIBLE)
```
Username:  john_donor
Password:  DonorPass123!@
Blood:     O+
City:      Mumbai
Status:    Eligible to Donate (last donation 80 days ago)
```

#### Donor 2 - AB- Blood Type (NOT ELIGIBLE YET)
```
Username:  priya_donor
Password:  DonorPass123!@
Blood:     AB-
City:      Delhi
Status:    Not Eligible (last donation 30 days ago)
```

#### Donor 3 - B+ Blood Type (NEVER DONATED)
```
Username:  rajesh_donor
Password:  DonorPass123!@
Blood:     B+
City:      Bangalore
Status:    Eligible to Donate (first time)
```

---

### BLOOD BANK ACCOUNTS

#### Blood Bank 1 - Central Blood Bank
```
Username:  central_bank
Password:  BankPass123!@
Bank Name: Central Blood Bank
License:   BB/2024/001
City:      Mumbai
```

#### Blood Bank 2 - Red Cross Blood Bank
```
Username:  redcross_bank
Password:  BankPass123!@
Bank Name: Red Cross Blood Bank
License:   BB/2024/002
City:      Delhi
```

---

### HOSPITAL ACCOUNTS

#### Hospital 1 - Metro Hospital (HAS Blood Bank)
```
Username:  metro_hospital
Password:  HospitalPass123!@
Name:      Metro Hospital
License:   HOS/2024/001
City:      Mumbai
Has Bank:  YES
```

#### Hospital 2 - Care Hospital (NO Blood Bank)
```
Username:  care_hospital
Password:  HospitalPass123!@
Name:      Care Hospital
License:   HOS/2024/002
City:      Bangalore
Has Bank:  NO
```

---

## 📊 Test Data Overview

### Blood Inventory (Available)
- **50 units** O+ Whole Blood (Expires: 10 days)
- **30 units** AB- Plasma (Expires: 85 days)
- **40 units** A+ Platelets (Expires: 6 days)
- **20 units** O- Whole Blood (Expires: 8 days)

### Blood Requests (Pending)
- **CRITICAL**: 10 units O+ by Metro Hospital
- **HIGH**: 5 units AB- Plasma by Metro Hospital
- **MEDIUM**: 15 units B+ by Care Hospital
- **LOW**: 20 units A+ Platelets by Care Hospital

### Donor Health Info
All donors have complete health information:
- Height, Weight, Blood Pressure
- Hemoglobin Level
- Last Checkup Date
- Health Status (No diseases/medications)

---

## 🚀 Quick Test Sequences

### Test Sequence 1: Donor Flow
1. Login as `john_donor`
2. View Donor Dashboard
3. Check eligibility (should show 100%)
4. View donation history
5. View health information
6. See urgent blood requests
7. Click "Schedule Donation"

### Test Sequence 2: Blood Bank Flow
1. Login as `central_bank`
2. View Blood Bank Dashboard
3. Click "Add New Inventory"
4. Add: 25 units O+ Whole Blood
5. Verify it appears in inventory table
6. View charts
7. See hospital requests
8. Click "Fulfill" on CRITICAL request
9. Verify status changes to FULFILLED

### Test Sequence 3: Hospital Flow
1. Login as `metro_hospital`
2. View Hospital Dashboard
3. Click "Create Blood Request"
4. Create request: 20 units AB- Plasma, URGENT
5. Verify request appears in table
6. Click "Search Available Blood"
7. Search for O+ (should find Red Cross bank inventory)
8. View request trends and charts

### Test Sequence 4: Cross-Platform
1. Login as `john_donor` → View urgent requests
2. Logout → Login as `metro_hospital`
3. Create request for O+ blood
4. Logout → Login as `central_bank`
5. See the new hospital request
6. Fulfill the request
7. Logout → Login as hospital
8. Verify request is now FULFILLED

---

## 🌐 Server URLs

```
Backend API:      http://localhost:8000
Backend Admin:    http://localhost:8000/admin
Frontend App:     http://localhost:3000 (or :5173)
```

---

## 📝 File Locations

```
Backend:
  - Main: c:\clg\mini_project\blood_supply\backend\
  - Test Data Script: populate_test_data.py
  - Models: accounts/models.py, inventory/models.py
  - Views: accounts/views.py, inventory/views.py
  - API: accounts/urls.py, inventory/urls.py

Frontend:
  - Main: c:\clg\mini_project\blood_supply\frontend\
  - Pages: src/pages/Dashboard/
    - DonorDashboard.jsx
    - BloodBankDashboard.jsx
    - HospitalDashboard.jsx
  - API Client: src/services/api.js
  - Auth Context: src/contexts/AuthContext.jsx
  - Login Page: src/pages/Login.jsx
  - Register Page: src/pages/Register.jsx

Documentation:
  - Full Testing Guide: TESTING_GUIDE.md
  - Quick Start: QUICK_START_TESTING.md
  - This File: QUICK_CREDENTIALS.md
```

---

## 🔄 Common Testing Actions

### Add Blood Inventory (As Blood Bank)
```
Form Fill:
- Blood Group: O+
- Component Type: WHOLE_BLOOD
- Quantity: 50
- Collection Date: 2026-01-15
- Storage Temperature: 4
- Storage Location: Fridge A
```

### Create Blood Request (As Hospital)
```
Form Fill:
- Blood Group: O+
- Component Type: WHOLE_BLOOD
- Quantity Required: 10
- Urgency: CRITICAL
- Patient Details: Emergency case
- Purpose: Surgery
- Required By: 2026-01-25
```

### Update Donor Health Info
```
Form Fill:
- Height: 180 cm
- Weight: 75 kg
- Blood Pressure: 120/80
- Hemoglobin: 15.5 g/dL
- Last Checkup: 2026-01-15
```

---

## ✅ Validation Checks

| Field | Valid | Invalid |
|-------|-------|---------|
| Username | 5+ chars, alphanumeric | john@, admin# |
| Email | valid@email.com | invalidemail, @test |
| Phone | 10 digits | 123, 12345 |
| Password | 8+ chars with upper, lower, number, special | password123 |
| Blood Group | A+, A-, B+, B-, O+, O-, AB+, AB- | AB, O, X+ |
| Date | YYYY-MM-DD format | 01/15/2026, 15-01-2026 |

---

## 🐛 Debug Commands

### Check Database Data
```bash
cd blood_supply/backend
python manage.py shell
>>> from django.contrib.auth import get_user_model
>>> User = get_user_model()
>>> User.objects.all()
>>> User.objects.filter(user_type='DONOR')
```

### Create Superuser
```bash
python manage.py createsuperuser
```

### Reset Database
```bash
# Delete old database
rm db.sqlite3

# Create new database
python manage.py makemigrations
python manage.py migrate

# Populate test data
python populate_test_data.py
```

### Run Tests
```bash
python manage.py test
```

---

## 📞 Support Information

### API Response Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **401**: Unauthorized (token missing/invalid)
- **403**: Forbidden (permission denied)
- **404**: Not Found
- **500**: Server Error

### Error Examples
```
Invalid Credentials:
{
  "non_field_errors": ["Invalid credentials"]
}

Validation Error:
{
  "phone": ["This field may not be blank."],
  "blood_group": ["This field may not be blank."]
}

Token Expired:
{
  "detail": "Token is invalid or expired"
}
```

---

## 🎯 Test Completion Checklist

- [ ] All 7 test accounts created
- [ ] Can login as each user type
- [ ] Donor dashboard shows all sections
- [ ] Blood bank can add inventory
- [ ] Hospital can create requests
- [ ] Blood bank can fulfill requests
- [ ] Eligibility calculation works
- [ ] Charts display data
- [ ] Health info persists
- [ ] Logout works
- [ ] Token refresh works
- [ ] Error messages display
- [ ] Search functionality works
- [ ] All CRUD operations work
- [ ] Cross-platform data visibility works

---

**Generated**: January 21, 2026
**Application**: Blood Supply Chain Management System
**Version**: 1.0
