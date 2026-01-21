# Registration Error Debug Guide

## Problem
When clicking "Complete Registration", you get a "Registration failed" message with a 400 Bad Request error.

## Root Cause Analysis

The registration form requires specific fields to be filled out correctly:

### Required Fields (All Steps):
1. **Step 1: Account Type**
   - username (unique)
   - email (unique)
   - password (8+ chars with special characters)
   - password2 (must match password)
   - user_type (HOSPITAL, BLOOD_BANK, or DONOR)

2. **Step 2: Personal Information**
   - first_name
   - last_name
   - phone (unique)
   - address
   - city
   - state
   - pincode
   - country (defaults to "India")

3. **Step 3: Type-Specific Information**
   - **If HOSPITAL**: hospital_name (required)
   - **If BLOOD_BANK**: blood_bank_name (required)
   - **If DONOR**: blood_group (required), date_of_birth (required)

## How to Debug

### 1. Check Browser Console for Submission Data
Open browser DevTools (F12) and go to **Console** tab. Look for console logs like:
```
Submitting registration data: {...}
Error response: {...}
```

### 2. Check Network Tab
In DevTools **Network** tab:
- Look for the POST request to `/api/accounts/register/`
- Click on it and check the **Response** tab
- The error message will show which field failed validation

### 3. Common Validation Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `phone: "Phone is required"` | Phone field is empty | Fill in a 10-digit phone number |
| `address: "Address is required"` | Address field is empty | Fill in a complete address |
| `hospital_name: "Hospital name is required for hospitals"` | Didn't fill hospital name for Hospital type | Fill in hospital name in Step 3 |
| `blood_group: "Blood group is required for donors"` | Didn't select blood group for Donor type | Select a blood group from dropdown in Step 3 |
| `date_of_birth: "Date of birth is required for donors"` | Didn't enter DOB for Donor type | Enter your date of birth in Step 3 |

## Solution

### Ensure All Fields are Filled:

**Step 1:**
- [ ] Username (unique, alphanumeric)
- [ ] Email (valid email format)
- [ ] Password (8+ chars with numbers/special chars)
- [ ] Confirm Password (must match above)
- [ ] Select Account Type

**Step 2:**
- [ ] First Name
- [ ] Last Name
- [ ] Phone Number (10 digits, starting with 6-9)
- [ ] Address
- [ ] City
- [ ] State
- [ ] Pincode (6 digits)
- [ ] Country (auto-filled as "India")

**Step 3 (Based on Account Type):**

For **Hospital**:
- [ ] Hospital Name
- [ ] (Optional) License Number (if has blood bank)

For **Blood Bank**:
- [ ] Blood Bank Name
- [ ] (Optional) Blood Bank License

For **Donor**:
- [ ] Blood Group (select from dropdown: A+, A-, B+, B-, O+, O-, AB+, AB-)
- [ ] Date of Birth (select calendar or enter YYYY-MM-DD)

### Test with Sample Data:
```
Step 1:
  Username: JohnDoe2024
  Email: john.doe@example.com
  Password: SecurePass123!
  Confirm: SecurePass123!
  Type: DONOR

Step 2:
  First Name: John
  Last Name: Doe
  Phone: 9876543210
  Address: 123 Main Street, Apartment 4B
  City: Mumbai
  State: Maharashtra
  Pincode: 400001
  Country: India

Step 3 (for Donor):
  Blood Group: O+
  Date of Birth: 1990-01-15
```

## If Still Having Issues

1. **Check Backend Logs**: Look at terminal where Django is running for error messages
2. **Open DevTools Console**: F12 → Console tab → Look for error messages
3. **Network Inspector**: F12 → Network tab → Click POST to register → Response tab
4. **Try Unique Values**: Phone numbers must be unique. Each registration needs a new phone number

## Status Check
✅ Backend is running on `http://localhost:8000`
✅ CORS is configured for `http://localhost:3000`
✅ Registration endpoint is at `/api/accounts/register/`
