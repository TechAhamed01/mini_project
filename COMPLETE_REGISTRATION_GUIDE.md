# Complete Registration Guide - All 3 User Types

## ✅ FIXED ISSUES
1. **password2 field bug** - Now properly sent to backend
2. **CORS enabled** - Frontend can communicate with backend
3. **Enhanced validation** - Clear error messages for each field

---

## REGISTRATION STEPS FOR ALL TYPES

### **STEP 1: Account Type Selection**
Fill in ALL these fields:
- **Account Type**: Select one:
  - 🏥 Hospital
  - 🩸 Blood Bank  
  - ❤️ Donor
- **Username**: Unique username (alphanumeric, no spaces)
- **Email**: Valid email address
- **Password**: Strong password (8+ chars, mix of letters/numbers/symbols)
- **Confirm Password**: Must match password exactly

Click **NEXT** to proceed

---

### **STEP 2: Personal Information**
Fill in ALL these fields:
- **First Name**: Your first name
- **Last Name**: Your last name
- **Phone Number**: 10-digit number (must be unique)
- **Address**: Full street address
- **City**: Your city
- **State**: Your state
- **Pincode**: 6-digit postal code
- **Country**: India (auto-filled)

Click **NEXT** to proceed

---

### **STEP 3: Complete Registration**
This varies by account type:

#### **For HOSPITAL:**
```
Required:
✓ Hospital Name: Name of your hospital
✓ License Number: (optional but recommended)
✓ Has Blood Bank Facility: Check if applicable
```

#### **For BLOOD BANK:**
```
Required:
✓ Blood Bank Name: Official name of blood bank
✓ Blood Bank License: (optional)
```

#### **For DONOR:**
```
Required:
✓ Blood Group: SELECT from dropdown (A+, A-, B+, B-, O+, O-, AB+, AB-)
✓ Date of Birth: Your DOB (YYYY-MM-DD or use calendar)
```

Click **COMPLETE REGISTRATION** to submit

---

## 📋 SAMPLE TEST DATA

### **Test 1: HOSPITAL Registration**
```
STEP 1:
  Account Type: Hospital
  Username: hospitals_mumbai
  Email: hospital@example.com
  Password: Hospital@2024!
  Confirm: Hospital@2024!

STEP 2:
  First Name: Rajesh
  Last Name: Kumar
  Phone: 9876543210
  Address: 123 Medical Street, Healthcare Complex
  City: Mumbai
  State: Maharashtra
  Pincode: 400001
  Country: India

STEP 3:
  Hospital Name: Apollo Medical Center
  Has Blood Bank: YES (if applicable)
  License Number: HOS-2024-001
```

### **Test 2: BLOOD BANK Registration**
```
STEP 1:
  Account Type: Blood Bank
  Username: bloodbank_delhi
  Email: bloodbank@example.com
  Password: BloodBank@2024!
  Confirm: BloodBank@2024!

STEP 2:
  First Name: Priya
  Last Name: Singh
  Phone: 9876543211
  Address: 45 Blood Donation Center Road
  City: Delhi
  State: Delhi
  Pincode: 110001
  Country: India

STEP 3:
  Blood Bank Name: Red Cross Blood Bank
  Blood Bank License: BB-2024-001
```

### **Test 3: DONOR Registration**
```
STEP 1:
  Account Type: Donor
  Username: donor_bangalore
  Email: donor@example.com
  Password: Donor@2024!
  Confirm: Donor@2024!

STEP 2:
  First Name: Arun
  Last Name: Patel
  Phone: 9876543212
  Address: 789 Citizen Street, Apartment 5A
  City: Bangalore
  State: Karnataka
  Pincode: 560001
  Country: India

STEP 3:
  Blood Group: O+
  Date of Birth: 1992-06-15
```

---

## ❌ COMMON ERRORS & SOLUTIONS

| Error | Cause | Solution |
|-------|-------|----------|
| `password2: This field is required` | Confirm password not filled | Fill in Confirm Password field in Step 1 |
| `phone: Phone is required` | Phone field empty | Fill phone number with 10 digits |
| `hospital_name: Hospital name is required` | For Hospital type, didn't fill hospital name | Fill Hospital Name in Step 3 |
| `blood_group: Blood group is required` | For Donor type, blood group not selected | SELECT blood group from dropdown in Step 3 |
| `date_of_birth: Date of birth is required` | For Donor type, DOB not filled | Enter your date of birth in Step 3 |
| `username: User with this username already exists` | Username is taken | Try a different username |
| `email: User with this email already exists` | Email already registered | Use a different email |
| `phone: User with this phone already exists` | Phone number already registered | Use a different phone number |

---

## 🔍 HOW TO DEBUG IF ERROR OCCURS

1. **Open Browser DevTools**: Press `F12`
2. **Go to Console Tab**: Look for error messages
3. **Check Network Tab**: 
   - Find POST request to `/api/accounts/register/`
   - Click on Response tab
   - See exact validation error
4. **Look for console log**: "Submitting registration data: {...}"
5. **Report the error field and message**

---

## ✅ VALIDATION RULES

### Usernames & Emails:
- Each username must be unique
- Each email must be unique
- Each phone must be unique

### Password Requirements:
- Minimum 8 characters
- Must contain letters (a-z, A-Z)
- Must contain numbers (0-9)
- Must contain special characters (!@#$%^&*)

### Phone Numbers:
- Exactly 10 digits
- Must be unique in system
- Format: 9876543210 (no dashes or spaces)

### Blood Groups (Donor only):
- A+, A-, B+, B-, O+, O-, AB+, AB-

---

## 🚀 NEXT STEPS AFTER REGISTRATION

1. Check your email for verification (if applicable)
2. Go to Login page
3. Enter your username and password
4. Access your dashboard based on account type

---

## BACKEND & FRONTEND STATUS

✅ Backend Server: Running on `http://localhost:8000`
✅ Frontend: Running on `http://localhost:3000`
✅ CORS: Enabled for localhost:3000
✅ All endpoints: Ready for testing
