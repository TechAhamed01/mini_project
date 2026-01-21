# 🩸 Blood Supply Chain - Complete Testing Package

## 📦 What You've Received

This comprehensive testing package includes everything you need to test the Blood Supply Chain Management System.

---

## 📄 Documentation Files

### 1. **QUICK_CREDENTIALS.md** ⭐ START HERE
   - All test account credentials (ready to copy-paste)
   - Quick test sequences
   - Common testing actions
   - Debug commands
   
### 2. **QUICK_START_TESTING.md** 🚀 SETUP & RUN
   - Step-by-step to start backend/frontend
   - Quick test flows for each user type
   - Troubleshooting common issues
   - Testing checklist

### 3. **TESTING_GUIDE.md** 📋 COMPREHENSIVE
   - Complete sample data descriptions
   - Detailed test procedures (7 phases)
   - Expected results for each test
   - API endpoint reference

### 4. **API_TESTING_GUIDE.md** 🔌 API TESTING
   - 15 complete API endpoints documented
   - Request/response examples
   - cURL command examples
   - Error response formats

---

## 👥 Test Accounts Ready to Use

### Donors (3 accounts)
```
john_donor / DonorPass123!@      (O+, Eligible)
priya_donor / DonorPass123!@     (AB-, Not Eligible)
rajesh_donor / DonorPass123!@    (B+, Never Donated)
```

### Blood Banks (2 accounts)
```
central_bank / BankPass123!@     (Mumbai)
redcross_bank / BankPass123!@    (Delhi)
```

### Hospitals (2 accounts)
```
metro_hospital / HospitalPass123!@    (with blood bank)
care_hospital / HospitalPass123!@     (no blood bank)
```

---

## 🛠️ Setup Instructions

### Option 1: Manual Setup with Test Data Script

**Terminal 1 - Backend:**
```bash
cd c:\clg\mini_project\blood_supply\backend
python manage.py migrate
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd c:\clg\mini_project\blood_supply\frontend
npm run dev
```

**Terminal 3 - Populate Test Data:**
```bash
cd c:\clg\mini_project\blood_supply\backend
python populate_test_data.py
```

Then visit: **http://localhost:3000**

---

### Option 2: Manual Registration (No Script)

1. Backend & Frontend running
2. Go to `/register` page
3. Manually register each user type
4. Fill required fields from test data

---

## ✅ Test Flows - 3 Simple Sequences

### 🩸 Sequence 1: Test Donor (5 min)
```
1. Login: john_donor / DonorPass123!@
2. Verify dashboard shows: Blood group, donations, health info
3. Check eligibility shows 100% (ready to donate)
4. Click "Schedule Donation" button
5. View urgent blood requests in area
```

### 🏥 Sequence 2: Test Blood Bank (5 min)
```
1. Login: central_bank / BankPass123!@
2. Click "Add New Inventory"
3. Add: O+ Whole Blood, 50 units
4. Verify in inventory table
5. View hospital requests
6. Click "Fulfill" on CRITICAL request
```

### 🏨 Sequence 3: Test Hospital (5 min)
```
1. Login: metro_hospital / HospitalPass123!@
2. Click "Create Blood Request"
3. Request: 10 units O+, CRITICAL urgency
4. Submit request
5. Click "Search Available Blood"
6. Search for O+ (finds blood bank inventory)
```

---

## 📊 Sample Data Provided

### Blood Inventory (5 items ready)
- O+ Whole Blood: 50 units (expires 10 days)
- AB- Plasma: 30 units (expires 85 days)
- B+ RBC: 25 units (expires 5 days)
- A+ Platelets: 40 units (expires 6 days)
- O- Whole Blood: 20 units (expires 8 days)

### Blood Requests (4 items ready)
- CRITICAL: 10 O+ units by Metro Hospital
- HIGH: 5 AB- Plasma by Metro Hospital
- MEDIUM: 15 B+ units by Care Hospital
- LOW: 20 A+ Platelets by Care Hospital

### Donor Health Info
All donors have complete health profiles:
- Height, Weight, Blood Pressure
- Hemoglobin levels
- Last checkup dates
- No diseases/medications

---

## 🎯 Testing Dashboard

### Donor Dashboard Should Show ✓
- Welcome with name
- Blood group card
- Total donations count
- Eligibility percentage with progress bar
- Donation history table
- Health information panel
- Urgent blood requests section
- Schedule donation button

### Blood Bank Dashboard Should Show ✓
- Inventory summary cards
- Add new inventory button
- Bar chart (inventory by blood group)
- Pie chart (blood group distribution)
- Request fulfillment table
- Expiry alerts panel
- View expiry alerts button

### Hospital Dashboard Should Show ✓
- Request statistics cards
- Create blood request form
- Search available blood form
- Line chart (request trends)
- Pie chart (blood group distribution)
- Request management table
- Search results display

---

## 🔍 Quick Verification Checklist

After setup, verify these work:

- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:3000
- [ ] Can register new donor account
- [ ] Can register new blood bank account
- [ ] Can register new hospital account
- [ ] Can login as donor
- [ ] Can login as blood bank
- [ ] Can login as hospital
- [ ] Donor dashboard fully loads
- [ ] Blood bank can add inventory
- [ ] Hospital can create request
- [ ] Charts display data
- [ ] Search functionality works
- [ ] Logout works
- [ ] Error messages display

---

## 🚀 Running Tests in 3 Steps

### Step 1: Start Servers
```bash
# Terminal 1
cd blood_supply/backend && python manage.py runserver

# Terminal 2
cd blood_supply/frontend && npm run dev

# Terminal 3 (optional - populate data)
cd blood_supply/backend && python populate_test_data.py
```

### Step 2: Open Application
```
Browser: http://localhost:3000
```

### Step 3: Run Test Sequences
Use credentials from **QUICK_CREDENTIALS.md**
Follow sequences from **QUICK_START_TESTING.md**

---

## 📚 Documentation Structure

```
Root Project:
├── QUICK_CREDENTIALS.md ................. Test accounts (START HERE)
├── QUICK_START_TESTING.md .............. Quick setup & running
├── TESTING_GUIDE.md .................... Comprehensive test cases
├── API_TESTING_GUIDE.md ................ API endpoints & examples
└── this file (TESTING_PACKAGE.md) ...... Overview

Backend:
└── populate_test_data.py ............... Auto-populate database

Frontend:
└── src/pages/Dashboard/ ................ Dashboard components
    ├── DonorDashboard.jsx
    ├── BloodBankDashboard.jsx
    └── HospitalDashboard.jsx
```

---

## 💡 Pro Tips

1. **Copy-Paste Credentials**: All credentials in QUICK_CREDENTIALS.md are ready to copy
2. **Use Test Data Script**: Run `python populate_test_data.py` for instant test data
3. **Open DevTools**: Press F12 in browser to see any errors
4. **Check Console**: API errors appear in browser console (F12 → Console)
5. **Use Postman**: Import API examples for easier testing
6. **Backend Logs**: Check terminal for any server-side errors
7. **Clear Cache**: Ctrl+Shift+Delete if page looks broken

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
cd blood_supply/backend
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

### Connection Refused Error
- Verify backend is running: `http://localhost:8000`
- Check no other app using port 8000
- Restart backend server

### Blank Dashboard After Login
- Check browser console (F12) for errors
- Verify API calls are working
- Check network tab in DevTools
- Restart both frontend and backend

### Test Data Not Showing
```bash
cd blood_supply/backend
python manage.py shell
>>> from populate_test_data import main
>>> main()
```

### Database Issues
```bash
cd blood_supply/backend
rm db.sqlite3  # Delete old database
python manage.py migrate
python populate_test_data.py  # Recreate test data
```

---

## 📞 Common Questions

**Q: Do I need to register accounts manually?**
A: No! Use `python populate_test_data.py` to auto-create all test accounts.

**Q: Which port does the app run on?**
A: Frontend on port 3000, Backend on port 8000. Access app at http://localhost:3000

**Q: Can I use the same password for all accounts?**
A: Yes, but change `DonorPass123!@` to different password if desired.

**Q: How do I reset the database?**
A: Delete `db.sqlite3`, run `python manage.py migrate`, then `python populate_test_data.py`

**Q: Do I need a Postman collection?**
A: No, but see API_TESTING_GUIDE.md for examples. You can use browser DevTools or cURL.

**Q: How long should full testing take?**
A: Quick smoke test: 15 minutes. Comprehensive test: 1-2 hours.

---

## 📈 Test Coverage

This package covers:

✅ User Registration (all 3 types)
✅ User Login/Logout
✅ Dashboard Display (all 3 types)
✅ Profile Management
✅ Blood Inventory Management
✅ Blood Request Creation
✅ Request Fulfillment
✅ Search Functionality
✅ Health Information Management
✅ Eligibility Calculation
✅ Charts & Analytics
✅ Notifications
✅ Error Handling
✅ API Endpoints
✅ Cross-Platform Integration

---

## 🎓 Learning Resources

- **Django Documentation**: https://docs.djangoproject.com/
- **React Documentation**: https://react.dev/
- **Material-UI Documentation**: https://mui.com/
- **REST API Best Practices**: https://restfulapi.net/
- **Postman Learning**: https://learning.postman.com/

---

## 📝 Next Steps

1. ✅ Read **QUICK_CREDENTIALS.md** for all test accounts
2. ✅ Follow **QUICK_START_TESTING.md** to start servers
3. ✅ Run **python populate_test_data.py** to create test data
4. ✅ Login with test accounts and run test sequences
5. ✅ Refer to **TESTING_GUIDE.md** for detailed test cases
6. ✅ Use **API_TESTING_GUIDE.md** for backend API testing

---

## ✨ Summary

You now have:
- ✅ 7 pre-configured test accounts (ready to use)
- ✅ Sample blood inventory data
- ✅ Sample blood requests
- ✅ Donor health information
- ✅ Automated data population script
- ✅ 4 comprehensive testing guides
- ✅ API documentation with examples
- ✅ Troubleshooting guide
- ✅ Quick reference credentials

**Everything you need to fully test the Blood Supply Chain Management System!**

---

**Happy Testing! 🩸**

For questions or issues, refer to the specific documentation files or check the console/logs for error messages.

Generated: January 21, 2026
