# Blood Supply Chain - Complete Testing Guide

## Overview
This guide provides all necessary sample data and step-by-step testing procedures for the Blood Supply Chain Management System.

---

## PART 1: SAMPLE TEST DATA

### User Account Credentials

#### **1. DONOR ACCOUNTS**

**Donor 1 - O+ Blood Group**
```
Username: john_donor
Email: john@example.com
Password: DonorPass123!@
Phone: 9876543210
Blood Group: O+
Full Name: John Donor
Address: 123 Medical St
City: Mumbai
State: Maharashtra
Country: India
Pincode: 400001
```

**Donor 2 - AB- Blood Group**
```
Username: priya_donor
Email: priya@example.com
Password: DonorPass123!@
Phone: 9876543211
Blood Group: AB-
Full Name: Priya Sharma
Address: 456 Health Ave
City: Delhi
State: Delhi
Country: India
Pincode: 110001
```

**Donor 3 - B+ Blood Group**
```
Username: rajesh_donor
Email: rajesh@example.com
Password: DonorPass123!@
Phone: 9876543212
Blood Group: B+
Full Name: Rajesh Kumar
Address: 789 Care Rd
City: Bangalore
State: Karnataka
Country: India
Pincode: 560001
```

---

#### **2. BLOOD BANK ACCOUNTS**

**Blood Bank 1 - Central Blood Bank**
```
Username: central_bank
Email: central@bloodbank.com
Password: BankPass123!@
Phone: 9800000001
Blood Bank Name: Central Blood Bank
License Number: BB/2024/001
Address: 100 Hospital Complex
City: Mumbai
State: Maharashtra
Country: India
Pincode: 400001
```

**Blood Bank 2 - Red Cross Blood Bank**
```
Username: redcross_bank
Email: redcross@bloodbank.com
Password: BankPass123!@
Phone: 9800000002
Blood Bank Name: Red Cross Blood Bank
License Number: BB/2024/002
Address: 200 Care Center
City: Delhi
State: Delhi
Country: India
Pincode: 110001
```

---

#### **3. HOSPITAL ACCOUNTS**

**Hospital 1 - Metro Hospital (with blood bank)**
```
Username: metro_hospital
Email: metro@hospital.com
Password: HospitalPass123!@
Phone: 9855555001
Hospital Name: Metro Hospital
License Number: HOS/2024/001
Has Blood Bank: YES
Address: 300 Medical District
City: Mumbai
State: Maharashtra
Country: India
Pincode: 400001
```

**Hospital 2 - Care Hospital (without blood bank)**
```
Username: care_hospital
Email: care@hospital.com
Password: HospitalPass123!@
Phone: 9855555002
Hospital Name: Care Hospital
License Number: HOS/2024/002
Has Blood Bank: NO
Address: 400 Healing Lane
City: Bangalore
State: Karnataka
Country: India
Pincode: 560001
```

---

## PART 2: SAMPLE BLOOD INVENTORY DATA

### For Blood Banks (Blood Inventory Records)

**Blood Type 1 - O+ Whole Blood**
```
Blood Group: O+
Component Type: WHOLE_BLOOD
Quantity: 50 units
Collection Date: 2026-01-15
Expiry Date: 2026-02-15
Storage Temperature: 4°C
Storage Location: Refrigerator A - Shelf 1
Batch Number: BB001-OPN-20260115-001
Status: AVAILABLE
```

**Blood Type 2 - AB- Plasma**
```
Blood Group: AB-
Component Type: PLASMA
Quantity: 30 units
Collection Date: 2026-01-18
Expiry Date: 2026-04-18
Storage Temperature: -20°C
Storage Location: Freezer C - Rack 2
Batch Number: BB001-ABM-20260118-002
Status: AVAILABLE
```

**Blood Type 3 - B+ Red Blood Cells**
```
Blood Group: B+
Component Type: RBC
Quantity: 25 units
Collection Date: 2026-01-10
Expiry Date: 2026-02-10
Storage Temperature: 4°C
Storage Location: Refrigerator B - Shelf 3
Batch Number: BB001-BPN-20260110-003
Status: TESTING
```

**Blood Type 4 - A+ Platelets**
```
Blood Group: A+
Component Type: PLATELETS
Quantity: 40 units
Collection Date: 2026-01-20
Expiry Date: 2026-01-27
Storage Temperature: 22°C
Storage Location: Agitator A - Slot 1
Batch Number: BB001-APN-20260120-004
Status: AVAILABLE
```

---

### Donor Health Information

**For John Donor (O+ Group)**
```
Height: 180 cm
Weight: 75 kg
Blood Pressure: 120/80
Hemoglobin Level: 15.5 g/dL
Last Checkup Date: 2026-01-15
Is Smoker: NO
Is Alcoholic: NO
Diseases: None
Medications: None
```

**For Priya Donor (AB- Group)**
```
Height: 165 cm
Weight: 60 kg
Blood Pressure: 118/76
Hemoglobin Level: 14.2 g/dL
Last Checkup Date: 2026-01-18
Is Smoker: NO
Is Alcoholic: NO
Diseases: None
Medications: None
```

---

## PART 3: STEP-BY-STEP TESTING PROCEDURES

### **PHASE 1: User Registration & Login Testing**

#### Test 1.1: Register as Donor
1. Go to `http://localhost:3000/register`
2. Fill in donor registration form with data from "Donor 1" above
3. Select "Donor" as login type
4. Click "Sign Up"
5. **Expected Result**: Account created successfully, redirected to login

#### Test 1.2: Login as Donor
1. Go to `http://localhost:3000/login`
2. Enter username: `john_donor` and password: `DonorPass123!@`
3. Select "Donor" as login type
4. Click "Sign In"
5. **Expected Result**: Login successful, redirected to Donor Dashboard

#### Test 1.3: Register & Login as Blood Bank
1. Register using Blood Bank 1 credentials
2. Select "Blood Bank" as login type
3. Login with registered credentials
4. **Expected Result**: Redirected to Blood Bank Dashboard

#### Test 1.4: Register & Login as Hospital
1. Register using Hospital 1 credentials
2. Select "Hospital" as login type
3. Login with registered credentials
4. **Expected Result**: Redirected to Hospital Dashboard

---

### **PHASE 2: Donor Dashboard Testing**

**Prerequisites**: Login as Donor (john_donor)

#### Test 2.1: View Donor Profile Card
1. Check the Welcome section displays:
   - Welcome message with first name
   - "Donor Dashboard - Your Lifesaving Journey" subtitle
2. **Expected**: Profile greeting visible

#### Test 2.2: View Stats Cards
1. Check Blood Group card shows: O+
2. Check Total Donations count
3. Check Eligibility percentage (should show progress bar)
4. Check Urgent Requests count
5. **Expected**: All stats display correctly

#### Test 2.3: View Health Information
1. Scroll to "Health Information" section on right panel
2. Check displays:
   - Height: 180 cm
   - Weight: 75 kg
   - Hemoglobin: 15.5 g/dL
   - Last Checkup date
3. Click "Update Health Info" button
4. **Expected**: Form opens to update health data

#### Test 2.4: View Donation History
1. Scroll to "Donation History" table
2. See donation records if available
3. Check columns: Date, Blood Bank, Blood Group, Component, Quantity, Status
4. **Expected**: Donation history displayed in table format

#### Test 2.5: View Urgent Blood Requests
1. Check "Urgent Blood Requests" section
2. Should show requests matching donor's blood group (O+)
3. Each alert shows hospital name and required quantity
4. Click "View All Requests" button
5. **Expected**: Requests filtered by blood group displayed

#### Test 2.6: Check Eligibility
1. View "Next Donation Eligibility" section
2. Check eligibility progress bar
3. If eligible (100%), "Schedule Donation" button is enabled (red)
4. If not eligible, button is disabled (gray)
5. Shows days until next eligible donation
6. **Expected**: Eligibility status and timeline correct

---

### **PHASE 3: Blood Bank Dashboard Testing**

**Prerequisites**: Login as Blood Bank (central_bank)

#### Test 3.1: View Blood Bank Dashboard Overview
1. Check Welcome section with Blood Bank name
2. View stats cards:
   - Total Inventory (units in stock)
   - Pending Requests
   - Expiring Soon count
   - Blood Types (8 groups)
3. **Expected**: All stats load correctly

#### Test 3.2: Add New Blood Inventory
1. Click "Add New Inventory" button
2. Fill in form:
   - Blood Group: O+
   - Component Type: WHOLE_BLOOD
   - Quantity: 50
   - Collection Date: 2026-01-15
   - Storage Temperature: 4
   - Storage Location: Refrigerator A - Shelf 1
   - (Donor ID: optional)
3. Click "Add to Inventory"
4. **Expected**: Success toast message, inventory added to table

#### Test 3.3: View Inventory Charts
1. Check "Inventory by Blood Group" bar chart
2. Verify blood group distribution chart
3. **Expected**: Charts display with correct data

#### Test 3.4: View Recent Blood Requests
1. Check "Recent Blood Requests" table
2. View columns: Hospital, Blood Group, Component, Quantity, Urgency, Status, Action
3. For PENDING requests, click "Fulfill" button
4. **Expected**: Request fulfilled, status updated

#### Test 3.5: View Expiry Alerts
1. Check "Expiry Alerts" section on right
2. Should show blood units expiring within 7 days
3. Display: Blood group, quantity, days until expiry
4. **Expected**: Expiring soon items highlighted

#### Test 3.6: Search Blood Functionality
1. View "View Expiry Alerts" button showing alert count
2. Click it to refresh alerts
3. **Expected**: Alerts refreshed

---

### **PHASE 4: Hospital Dashboard Testing**

**Prerequisites**: Login as Hospital (metro_hospital)

#### Test 4.1: View Hospital Dashboard Overview
1. Check Welcome section with Hospital name
2. View stats cards:
   - Pending Requests
   - Fulfilled Requests
   - Total Inventory (if has blood bank)
   - Expiring Soon (if has blood bank)
3. **Expected**: All stats display

#### Test 4.2: Create Blood Request
1. Click "Create Blood Request" button
2. Fill form:
   - Blood Group: O+
   - Component Type: WHOLE_BLOOD
   - Quantity Required: 10
   - Urgency: CRITICAL
   - Patient Details: Emergency patient
   - Purpose: Surgery
   - Required By: 2026-01-25
3. Click "Create Request"
4. **Expected**: Success toast, request added to table

#### Test 4.3: View Request Status
1. Check "Recent Blood Requests" table
2. Verify columns: Hospital, Blood Group, Component, Quantity, Urgency, Status, Action
3. Check urgency color coding:
   - CRITICAL: Red (#d32f2f)
   - HIGH: Orange (#f57c00)
   - MEDIUM: Yellow (#ffb300)
   - LOW: Green (#4caf50)
4. **Expected**: Correct status and colors shown

#### Test 4.4: Search for Available Blood
1. Click "Search Available Blood" button
2. Fill search form:
   - Blood Group: O+
   - Component: WHOLE_BLOOD
   - Quantity: 10
3. Click "Search"
4. **Expected**: Shows available blood units from blood banks

#### Test 4.5: View Request Trends Chart
1. Check "Request Trend (Last 6 Months)" line chart
2. **Expected**: Chart displays request data over time

#### Test 4.6: View Blood Group Distribution
1. Check pie chart showing blood group distribution
2. **Expected**: Visual distribution of blood groups

---

### **PHASE 5: Cross-Platform Testing**

#### Test 5.1: Donor makes blood request visible to Hospital
1. Login as Donor
2. View "Urgent Blood Requests" section
3. Logout
4. Login as Hospital (care_hospital)
5. Click "Search Available Blood" and search for donor's blood group
6. **Expected**: Can see donor's blood availability

#### Test 5.2: Blood Bank inventory visible to Hospital
1. Login as Blood Bank, add inventory for O+
2. Logout
3. Login as Hospital
4. Search for O+ blood
5. **Expected**: Blood Bank inventory appears in search results

#### Test 5.3: Hospital requests visible to Blood Bank
1. Login as Hospital, create a CRITICAL request for AB+
2. Logout
3. Login as Blood Bank
4. Check "Recent Blood Requests" table
5. **Expected**: Hospital request appears with urgency indicator

#### Test 5.4: Fulfill Blood Request
1. Login as Blood Bank with AB- inventory
2. View "Recent Blood Requests"
3. Find hospital's AB+ request
4. Click "Fulfill" if inventory matches
5. **Expected**: Request status changes to FULFILLED

---

### **PHASE 6: Data Validation Testing**

#### Test 6.1: Invalid Login Credentials
1. Login page
2. Enter wrong username/password
3. **Expected**: "Invalid credentials. Please try again." error

#### Test 6.2: Duplicate Phone Number Registration
1. Try registering with existing phone number
2. **Expected**: "This phone number is already registered" error

#### Test 6.3: Duplicate Email Registration
1. Try registering with existing email
2. **Expected**: "This email is already registered" error

#### Test 6.4: Invalid Blood Group Input
1. Try to search/add with invalid blood group
2. **Expected**: Validation error or dropdown only allows valid groups

#### Test 6.5: Eligibility Calculation
1. Donor with last_donation_date 56+ days ago
2. Check eligibility = 100%
3. Donor with last_donation_date < 56 days ago
4. Check eligibility shows remaining days
5. **Expected**: Correct calculation

---

### **PHASE 7: API Testing (Optional - Using Postman)**

#### Base URL: `http://localhost:8000/api`

**Register Endpoint**
```
POST /accounts/register/
Body: {
  "username": "test_donor",
  "email": "test@example.com",
  "password": "TestPass123!@",
  "password2": "TestPass123!@",
  "first_name": "Test",
  "last_name": "Donor",
  "user_type": "DONOR",
  "phone": "9999999999",
  "address": "Test Address",
  "city": "Test City",
  "state": "Test State",
  "country": "India",
  "pincode": "123456",
  "blood_group": "O+"
}
```

**Login Endpoint**
```
POST /accounts/login/
Body: {
  "username": "john_donor",
  "password": "DonorPass123!@"
}
Response includes: access_token, refresh_token, user details
```

**Get Dashboard Data**
```
GET /accounts/dashboard/
Headers: Authorization: Bearer {access_token}
```

**Get Health Info (Donor)**
```
GET /accounts/health-info/
Headers: Authorization: Bearer {access_token}
```

**Add Blood Inventory**
```
POST /inventory/blood/
Headers: Authorization: Bearer {access_token}
Body: {
  "blood_group": "O+",
  "component_type": "WHOLE_BLOOD",
  "quantity": 50,
  "collection_date": "2026-01-15",
  "expiry_date": "2026-02-15",
  "storage_temperature": 4.0,
  "storage_location": "Fridge A",
  "batch_number": "BATCH001"
}
```

**Create Blood Request**
```
POST /inventory/requests/
Headers: Authorization: Bearer {access_token}
Body: {
  "blood_group": "O+",
  "component_type": "WHOLE_BLOOD",
  "quantity_required": 10,
  "urgency": "CRITICAL",
  "patient_details": "Emergency",
  "purpose": "Surgery",
  "required_by": "2026-01-25"
}
```

---

## PART 4: EXPECTED TEST RESULTS SUMMARY

| Test Case | Expected Result | Status |
|-----------|-----------------|--------|
| Donor Registration | Account created successfully | ✓ |
| Donor Login | Dashboard loads with data | ✓ |
| Blood Bank Registration | Account created, can add inventory | ✓ |
| Hospital Registration | Account created, can create requests | ✓ |
| Donor Dashboard Display | All sections visible (stats, health, donations, requests) | ✓ |
| Blood Bank Inventory | Can add, view, and manage blood inventory | ✓ |
| Hospital Requests | Can create, view, and search for blood | ✓ |
| Eligibility Calculation | Correct percentage based on last donation | ✓ |
| Cross-Platform Visibility | Hospital sees Blood Bank inventory | ✓ |
| Request Fulfillment | Blood Bank can fulfill hospital requests | ✓ |
| Error Handling | Proper validation messages displayed | ✓ |

---

## TROUBLESHOOTING

### Backend not running
```bash
cd blood_supply/backend
python manage.py runserver
```

### Frontend not running
```bash
cd blood_supply/frontend
npm run dev
```

### Database issues
```bash
cd blood_supply/backend
python manage.py makemigrations
python manage.py migrate
```

### Clear all data and start fresh
```bash
cd blood_supply/backend
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

---

## Notes
- All passwords should be strong (contain uppercase, lowercase, numbers, special characters)
- Phone numbers must be unique per registration
- Eligibility calculation: 56 days minimum between donations
- Blood requests are automatically matched with nearby blood banks based on city
- Status updates happen in real-time across all dashboards

