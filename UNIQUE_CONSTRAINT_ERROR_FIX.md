# ❌ UNIQUE Constraint Error - Solution

## Problem
When registering, you see this error:
```
UNIQUE constraint failed: accounts_user_phone
detail: UNIQUE constraint failed: accounts_user_phone
```

## Root Cause
The phone number you used already exists in the database from a previous registration attempt. Phone numbers must be unique - each person can only register with one phone number.

## ✅ Solution

### Quick Fix: Use a Different Phone Number

Each of the test accounts needs a **different phone number**. Here are options:

**If you already registered with:**
- 9876543210 → Try: 9876543211
- 9911223344 → Try: 9911223345
- 9922334455 → Try: 9922334456
- 9933445566 → Try: 9933445567

### Complete Test Data (All Unique Phone Numbers)

#### Hospital Registration:
```
Username: hospital_test_001
Email: hospital@test.com
Password: Hospital@2024!
Confirm: Hospital@2024!

First Name: John
Last Name: Anderson
Phone: 9876543211 ← UNIQUE
Address: 456 Medical Center Boulevard
City: Delhi
State: Delhi
Pincode: 110001

Hospital Name: Apollo Hospitals
```

#### Blood Bank Registration:
```
Username: bloodbank_test_001
Email: bloodbank@test.com
Password: BloodBank@2024!
Confirm: BloodBank@2024!

First Name: Priya
Last Name: Singh
Phone: 9876543212 ← DIFFERENT from Hospital
Address: 789 Blood Donation Center
City: Mumbai
State: Maharashtra
Pincode: 400001

Blood Bank Name: Red Cross Blood Bank
```

#### Donor Registration:
```
Username: donor_test_001
Email: donor@test.com
Password: Donor@2024!
Confirm: Donor@2024!

First Name: Arun
Last Name: Patel
Phone: 9876543213 ← DIFFERENT from both
Address: 321 Citizens Street
City: Bangalore
State: Karnataka
Pincode: 560001

Blood Group: O+
Date of Birth: 1995-03-20
```

---

## 🔍 How to Generate New Phone Numbers

Use this pattern:
```
Base: 98765432XX

Where XX increments:
00 → 9876543200 (first)
01 → 9876543201 (second)
02 → 9876543202 (third)
03 → 9876543203 (fourth)
...and so on
```

Or simply change the last 2 digits each time:
- 9876543210
- 9876543211
- 9876543212
- 9876543213
- etc.

---

## 💾 Database Unique Constraints

These fields **must be unique** (no duplicates):
1. **Username** - Each user needs a different username
2. **Email** - Each user needs a different email
3. **Phone** - Each user needs a different phone number

---

## ✨ Improved Error Messages

The backend has been updated to show clearer messages:

```
❌ OLD ERROR:
"UNIQUE constraint failed: accounts_user_phone"

✅ NEW ERROR:
"This phone number is already registered. Please use a different phone number."
```

---

## 🧹 (Optional) Reset Database

If you want to start fresh with all your test data:

1. Delete the database file:
   ```
   c:\clg\mini_project\blood_supply\backend\db.sqlite3
   ```

2. Create fresh database:
   ```
   cd c:\clg\mini_project\blood_supply\backend
   python manage.py migrate
   ```

3. Start fresh registration with any phone numbers you want

---

## ✅ Now You Can:

1. Use the new phone numbers above
2. Try registering again
3. If you get the same error, increment the phone number by 1
4. All 3 registrations should work with unique phone numbers

**Ready? Try registering now with a unique phone number!** 🚀
