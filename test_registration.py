import requests
import json

# Test data
test_data = {
    "username": "testdonor2",
    "email": "testdonor2@example.com",
    "password": "TestPass123!",
    "password2": "TestPass123!",
    "user_type": "DONOR",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "9876543210",
    "address": "123 Test Street",
    "city": "Test City",
    "state": "Test State",
    "country": "India",
    "pincode": "123456",
    "blood_group": "O+",
    "date_of_birth": "1990-01-15"
}

# Make the request
url = "http://localhost:8000/api/accounts/register/"
headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, json=test_data, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
