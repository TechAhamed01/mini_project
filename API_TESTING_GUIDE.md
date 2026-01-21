# API Testing Guide - Using Postman or cURL

## Base URL
```
http://localhost:8000/api
```

---

## Authentication Flow

### 1️⃣ POST /accounts/login/
**Login and get tokens**

```json
{
  "username": "john_donor",
  "password": "DonorPass123!@"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "access": "eyJhbGc...",
  "refresh": "eyJhbGc...",
  "user": {
    "id": 1,
    "username": "john_donor",
    "email": "john@example.com",
    "first_name": "John",
    "blood_group": "O+",
    "user_type": "DONOR"
  }
}
```

**Save the `access` token for subsequent API calls**

---

### 2️⃣ POST /accounts/register/
**Register new user**

```json
{
  "username": "newdonor",
  "email": "newdonor@example.com",
  "password": "NewPass123!@",
  "password2": "NewPass123!@",
  "first_name": "New",
  "last_name": "Donor",
  "user_type": "DONOR",
  "phone": "9999999999",
  "blood_group": "O+",
  "address": "123 Test St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "country": "India",
  "pincode": "400001",
  "date_of_birth": "1995-06-15"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user_id": 8,
  "user_type": "DONOR"
}
```

---

## User Profile Endpoints

### 3️⃣ GET /accounts/profile/
**Get logged-in user profile**

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "john_donor",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Donor",
  "phone": "9876543210",
  "blood_group": "O+",
  "user_type": "DONOR",
  "address": "123 Medical St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "country": "India",
  "pincode": "400001",
  "is_available": true,
  "last_donation_date": "2025-10-22"
}
```

---

### 4️⃣ GET /accounts/dashboard/
**Get dashboard data based on user type**

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response for DONOR (200 OK):**
```json
{
  "total_donations": 5,
  "last_donation_date": "2025-10-22",
  "upcoming_requests": 3,
  "unread_notifications": 2
}
```

**Response for BLOOD_BANK (200 OK):**
```json
{
  "total_inventory_units": 200,
  "inventory_by_blood_group": {
    "A+": 25,
    "A-": 15,
    "B+": 30,
    "B-": 20,
    "O+": 50,
    "O-": 20,
    "AB+": 15,
    "AB-": 25
  },
  "pending_requests": 8,
  "expiring_soon_count": 3,
  "unread_notifications": 1
}
```

**Response for HOSPITAL (200 OK):**
```json
{
  "pending_requests": 5,
  "fulfilled_requests": 12,
  "total_inventory_units": 100,
  "expiring_soon_count": 2,
  "unread_notifications": 3
}
```

---

### 5️⃣ GET /accounts/health-info/
**Get donor health information**

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "donor": 1,
  "height": 180,
  "weight": 75,
  "blood_pressure": "120/80",
  "hemoglobin_level": 15.5,
  "last_checkup_date": "2026-01-15",
  "is_smoker": false,
  "is_alcoholic": false,
  "diseases": "",
  "medications": ""
}
```

---

### 6️⃣ PATCH /accounts/health-info/
**Update donor health information**

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "height": 181,
  "weight": 76,
  "blood_pressure": "118/78",
  "hemoglobin_level": 15.8,
  "last_checkup_date": "2026-01-20",
  "is_smoker": false,
  "is_alcoholic": false,
  "diseases": "",
  "medications": ""
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "donor": 1,
  "height": 181,
  "weight": 76,
  "blood_pressure": "118/78",
  "hemoglobin_level": 15.8,
  "last_checkup_date": "2026-01-20",
  "is_smoker": false,
  "is_alcoholic": false,
  "diseases": "",
  "medications": ""
}
```

---

## Inventory Endpoints

### 7️⃣ GET /inventory/blood/
**Get all blood inventory (with optional filters)**

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters (Optional):**
```
?blood_group=O+
?status=AVAILABLE
?donor=1
?blood_bank=2
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "blood_group": "O+",
    "component_type": "WHOLE_BLOOD",
    "quantity": 50,
    "unit_volume": 450,
    "status": "AVAILABLE",
    "collection_date": "2026-01-15",
    "expiry_date": "2026-02-15",
    "storage_temperature": 4,
    "storage_location": "Refrigerator A - Shelf 1",
    "batch_number": "BB001-OPN-20260115-001",
    "is_tested": true,
    "test_date": "2026-01-16",
    "blood_bank": 2,
    "blood_bank_details": {
      "blood_bank_name": "Central Blood Bank",
      "city": "Mumbai"
    },
    "donor": 1,
    "created_at": "2026-01-15T10:30:00Z"
  }
]
```

---

### 8️⃣ POST /inventory/blood/
**Add new blood inventory (Blood Bank only)**

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "blood_group": "AB-",
  "component_type": "PLASMA",
  "quantity": 30,
  "unit_volume": 200,
  "collection_date": "2026-01-20",
  "expiry_date": "2026-04-20",
  "storage_temperature": -20,
  "storage_location": "Freezer C - Rack 2",
  "batch_number": "BB002-ABM-20260120-001",
  "donor": null,
  "status": "TESTING"
}
```

**Response (201 Created):**
```json
{
  "id": 5,
  "blood_group": "AB-",
  "component_type": "PLASMA",
  "quantity": 30,
  "status": "TESTING",
  "batch_number": "BB002-ABM-20260120-001",
  "created_at": "2026-01-20T14:25:00Z"
}
```

---

### 9️⃣ GET /inventory/requests/
**Get all blood requests**

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "hospital": 3,
    "hospital_details": {
      "hospital_name": "Metro Hospital",
      "city": "Mumbai"
    },
    "blood_group": "O+",
    "component_type": "WHOLE_BLOOD",
    "quantity_required": 10,
    "urgency": "CRITICAL",
    "status": "PENDING",
    "patient_details": "Emergency surgery patient",
    "purpose": "Emergency Surgery",
    "required_by": "2026-01-25",
    "created_at": "2026-01-22T08:15:00Z",
    "created_by": 3
  }
]
```

---

### 🔟 POST /inventory/requests/
**Create blood request (Hospital only)**

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "blood_group": "B+",
  "component_type": "RBC",
  "quantity_required": 15,
  "urgency": "HIGH",
  "patient_details": "Post-operative patient",
  "purpose": "Post-operative transfusion",
  "required_by": "2026-01-28"
}
```

**Response (201 Created):**
```json
{
  "id": 4,
  "blood_group": "B+",
  "component_type": "RBC",
  "quantity_required": 15,
  "urgency": "HIGH",
  "status": "PENDING",
  "created_at": "2026-01-22T10:45:00Z"
}
```

---

### 1️⃣1️⃣ POST /inventory/requests/{id}/fulfill/
**Fulfill blood request (Blood Bank only)**

**Headers:**
```
Authorization: Bearer {access_token}
```

**Body (empty):**
```json
{}
```

**Response (200 OK):**
```json
{
  "message": "Request fulfilled successfully",
  "status": "FULFILLED"
}
```

---

### 1️⃣2️⃣ POST /inventory/search/
**Search for available blood (Hospital only)**

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Body:**
```json
{
  "blood_group": "O+",
  "component_type": "WHOLE_BLOOD",
  "quantity": 10
}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "blood_group": "O+",
    "component_type": "WHOLE_BLOOD",
    "quantity": 50,
    "status": "AVAILABLE",
    "distance": 0.5,
    "blood_bank": 2,
    "blood_bank_details": {
      "blood_bank_name": "Central Blood Bank",
      "city": "Mumbai",
      "address": "100 Hospital Complex"
    },
    "expiry_date": "2026-02-15"
  }
]
```

---

### 1️⃣3️⃣ GET /inventory/expiry-alerts/
**Get blood inventory expiring soon (Blood Bank only)**

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "alerts": [
    {
      "id": 3,
      "blood_group": "A+",
      "component_type": "PLATELETS",
      "quantity": 40,
      "batch_number": "BB001-APN-20260120-004",
      "expiry_date": "2026-01-27",
      "days_until_expiry": 5,
      "storage_location": "Agitator A - Slot 1"
    }
  ]
}
```

---

## Notification Endpoints

### 1️⃣4️⃣ GET /notifications/
**Get user notifications**

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user": 1,
    "title": "Urgent Blood Request",
    "message": "Metro Hospital needs O+ blood urgently",
    "notification_type": "BLOOD_REQUEST",
    "is_read": false,
    "created_at": "2026-01-22T09:30:00Z"
  }
]
```

---

### 1️⃣5️⃣ PATCH /notifications/{id}/read/
**Mark notification as read**

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "is_read": true
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "blood_group": ["This field is required."],
  "quantity": ["Ensure this value is greater than or equal to 1."]
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error."
}
```

---

## cURL Examples

### Login
```bash
curl -X POST http://localhost:8000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_donor",
    "password": "DonorPass123!@"
  }'
```

### Get Dashboard (with token)
```bash
curl -X GET http://localhost:8000/api/accounts/dashboard/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Add Blood Inventory
```bash
curl -X POST http://localhost:8000/api/inventory/blood/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "blood_group": "O+",
    "component_type": "WHOLE_BLOOD",
    "quantity": 50,
    "collection_date": "2026-01-15",
    "expiry_date": "2026-02-15",
    "storage_temperature": 4,
    "storage_location": "Refrigerator A",
    "batch_number": "BATCH001"
  }'
```

### Create Blood Request
```bash
curl -X POST http://localhost:8000/api/inventory/requests/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "blood_group": "O+",
    "component_type": "WHOLE_BLOOD",
    "quantity_required": 10,
    "urgency": "CRITICAL",
    "patient_details": "Emergency",
    "purpose": "Surgery",
    "required_by": "2026-01-25"
  }'
```

---

## Postman Collection
You can import this as a Postman collection for easier testing.

1. Create new collection "Blood Supply API"
2. Add requests with the examples above
3. Set environment variable: `base_url = http://localhost:8000/api`
4. Set auth token after login
5. Test each endpoint

---

**Tips:**
- Always use `Authorization: Bearer {token}` header for authenticated endpoints
- Test both success and error scenarios
- Verify response status codes
- Check response data matches expected format
- Test with invalid data to verify validation

