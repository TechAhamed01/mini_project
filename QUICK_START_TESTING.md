# Quick Start - Running the Application & Testing

## 1. SETUP & START SERVERS

### Terminal 1 - Start Backend
```bash
cd c:\clg\mini_project\blood_supply\backend
python manage.py migrate
python manage.py runserver
```

**Expected Output:**
```
Starting development server at http://127.0.0.1:8000/
```

---

### Terminal 2 - Start Frontend
```bash
cd c:\clg\mini_project\blood_supply\frontend
npm run dev
```

**Expected Output:**
```
  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

### Terminal 3 - Populate Test Data (Optional)
```bash
cd c:\clg\mini_project\blood_supply\backend
python manage.py shell
>>> exec(open('populate_test_data.py').read())
```

Or use:
```bash
cd c:\clg\mini_project\blood_supply\backend
python populate_test_data.py
```

---

## 2. ACCESS THE APPLICATION

Open browser and go to: **http://localhost:3000**

---

## 3. QUICK TEST FLOW

### ✅ Test as Donor
1. Go to Login page
2. Select **Donor** tab
3. Enter: `john_donor` / `DonorPass123!@`
4. Click **Sign In**
5. **Expected**: Donor Dashboard shows:
   - Welcome message
   - Blood Group: O+
   - Donation history
   - Health information
   - Urgent requests
   - Eligibility status

---

### ✅ Test as Blood Bank
1. Go to Login page
2. Select **Blood Bank** tab
3. Enter: `central_bank` / `BankPass123!@`
4. Click **Sign In**
5. **Expected**: Blood Bank Dashboard shows:
   - Inventory summary
   - Add New Inventory button
   - Request table
   - Charts (Bar & Pie)
   - Expiry alerts

---

### ✅ Test as Hospital
1. Go to Login page
2. Select **Hospital** tab
3. Enter: `metro_hospital` / `HospitalPass123!@`
4. Click **Sign In**
5. **Expected**: Hospital Dashboard shows:
   - Request statistics
   - Create request button
   - Search blood function
   - Request trends chart
   - Blood group distribution

---

## 4. KEY FEATURES TO TEST

### Feature 1: Register New Account
- Go to `/register`
- Fill all required fields
- Select user type
- Click Sign Up
- **Check**: Redirects to login with success message

### Feature 2: Add Blood Inventory (As Blood Bank)
- Click "Add New Inventory"
- Fill form:
  - Blood Group: O+
  - Component: WHOLE_BLOOD
  - Quantity: 50
  - Dates and location
- Click "Add to Inventory"
- **Check**: Appears in inventory table

### Feature 3: Create Blood Request (As Hospital)
- Click "Create Blood Request" or use form
- Fill:
  - Blood Group: O+
  - Quantity: 10
  - Urgency: CRITICAL
  - Other details
- Click "Create Request"
- **Check**: Appears in request table

### Feature 4: Search Blood (As Hospital)
- Click "Search Available Blood"
- Select blood group and quantity
- Click "Search"
- **Check**: Shows available blood from banks

### Feature 5: Update Donor Health Info
- As Donor, click "Update Health Info"
- Fill health details
- Save
- **Check**: Data persists on dashboard reload

---

## 5. TROUBLESHOOTING

### Problem: Backend won't start
```
Solution:
cd blood_supply/backend
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### Problem: "Connection refused" error
```
Solution:
- Ensure backend is running on http://localhost:8000
- Check no other process using port 8000
- Try: netstat -ano | findstr :8000 (Windows)
```

### Problem: Frontend shows blank page
```
Solution:
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors (F12)
- Restart frontend: Ctrl+C then npm run dev
```

### Problem: "Invalid credentials" on login
```
Solution:
- Verify username/password from QUICK_CREDENTIALS.md
- Ensure correct user type tab is selected
- Check database has test data: python manage.py shell then User.objects.all()
```

### Problem: Test data not created
```
Solution:
cd blood_supply/backend
python manage.py shell
>>> from populate_test_data import *
>>> main()
```

---

## 6. TEST DATA SUMMARY

### 🩸 Donors (All eligible to donate)
| Username | Password | Blood | City |
|----------|----------|-------|------|
| john_donor | DonorPass123!@ | O+ | Mumbai |
| priya_donor | DonorPass123!@ | AB- | Delhi |
| rajesh_donor | DonorPass123!@ | B+ | Bangalore |

### 🏥 Blood Banks
| Username | Password | Name | City |
|----------|----------|------|------|
| central_bank | BankPass123!@ | Central Blood Bank | Mumbai |
| redcross_bank | BankPass123!@ | Red Cross Blood Bank | Delhi |

### 🏨 Hospitals
| Username | Password | Name | Has Bank | City |
|----------|----------|------|----------|------|
| metro_hospital | HospitalPass123!@ | Metro Hospital | YES | Mumbai |
| care_hospital | HospitalPass123!@ | Care Hospital | NO | Bangalore |

---

## 7. API ENDPOINTS (For Testing with Postman)

### Base URL
```
http://localhost:8000/api
```

### Authentication Endpoints
```
POST   /accounts/register/           - Register new user
POST   /accounts/login/              - Login (returns tokens)
POST   /accounts/logout/             - Logout
GET    /accounts/profile/            - Get user profile
GET    /accounts/dashboard/          - Get dashboard data
GET    /accounts/health-info/        - Get donor health info
PATCH  /accounts/health-info/        - Update donor health info
```

### Inventory Endpoints
```
GET    /inventory/blood/             - Get all blood inventory
POST   /inventory/blood/             - Add blood inventory
GET    /inventory/requests/          - Get all blood requests
POST   /inventory/requests/          - Create blood request
POST   /inventory/requests/{id}/fulfill/ - Fulfill request
POST   /inventory/search/            - Search for blood
GET    /inventory/expiry-alerts/     - Get expiry alerts
```

### Notification Endpoints
```
GET    /notifications/               - Get notifications
PATCH  /notifications/{id}/read/     - Mark notification as read
DELETE /notifications/{id}/          - Delete notification
```

---

## 8. EXPECTED DASHBOARDS AFTER LOGIN

### Donor Dashboard Components
```
✓ Welcome Section (Hero Card)
✓ Stats Cards (Blood Group, Total Donations, Eligibility, Urgent Requests)
✓ Donation History Table
✓ Health Information Panel
✓ Urgent Blood Requests List
✓ Next Donation Eligibility Progress Bar
✓ Schedule Donation Button
```

### Blood Bank Dashboard Components
```
✓ Welcome Section
✓ Inventory Stats Cards
✓ Add New Inventory Button
✓ Inventory by Blood Group Chart (Bar)
✓ Blood Group Distribution Chart (Pie)
✓ Recent Blood Requests Table
✓ Fulfill Button for PENDING Requests
✓ Expiry Alerts Panel
✓ View Expiry Alerts Button
```

### Hospital Dashboard Components
```
✓ Welcome Section
✓ Request Stats Cards
✓ Create Blood Request Form
✓ Search Available Blood Form
✓ Request Trend Chart (Line)
✓ Blood Group Distribution Chart (Pie)
✓ Recent Blood Requests Table
✓ View All Requests Button
```

---

## 9. TESTING CHECKLIST

- [ ] Backend server running on :8000
- [ ] Frontend server running on :5173 or :3000
- [ ] Can register new donor account
- [ ] Can register new blood bank account
- [ ] Can register new hospital account
- [ ] Can login as donor
- [ ] Can login as blood bank
- [ ] Can login as hospital
- [ ] Donor dashboard displays all sections
- [ ] Blood bank can add inventory
- [ ] Hospital can create blood request
- [ ] Hospital can search for blood
- [ ] Blood bank can see hospital requests
- [ ] Donor can view health information
- [ ] Eligibility calculation works correctly
- [ ] Charts display inventory data
- [ ] Request status updates properly
- [ ] Error messages show on validation failure
- [ ] Token refresh works on API calls
- [ ] Logout clears session properly

---

## 10. ADDITIONAL RESOURCES

📖 **Full Testing Guide**: See `TESTING_GUIDE.md` for detailed test cases

📝 **Test Data Script**: See `populate_test_data.py` for automated data population

🔍 **API Documentation**: Use Postman to test endpoints at http://localhost:8000/api

💾 **Database**: SQLite at `blood_supply/backend/db.sqlite3`

---

## Notes
- All test passwords contain uppercase, lowercase, numbers, and special characters
- Phone numbers are unique per account
- Donor eligibility requires 56 days between donations
- Blood requests are matched based on blood group and city
- All dates use Django timezone

