# Quick Fix: How to Create Delivery Zone and Get Zone ID

## Problem
You're getting this error when creating a provider:
```json
{
  "error": "Not Found",
  "message": "Zone not found with id 1"
}
```

## Solution: Create Delivery Zone First

### Step 1: Login as Admin

```
POST http://localhost:9090/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Save the token** from response.

### Step 2: Create Delivery Zone

```
POST http://localhost:9090/api/delivery-zones
Authorization: Bearer {your_admin_token}
Content-Type: application/json

{
  "zoneName": "Mumbai Central",
  "city": "Mumbai",
  "pincodeRanges": "400001,400002,400003"
}
```

**Request Body Fields:**
- `zoneName`: Name of the zone (e.g., "Mumbai Central", "Delhi North")
- `city`: City name (e.g., "Mumbai", "Delhi")
- `pincodeRanges`: Comma-separated pincodes as a **string** (e.g., "400001,400002,400003")

**Expected Response:**
```json
{
  "id": 1,
  "zoneName": "Mumbai Central",
  "city": "Mumbai",
  "pincodeRanges": "400001,400002,400003",
  "createdAt": "2024-01-15T10:00:00",
  "updatedAt": "2024-01-15T10:00:00"
}
```

**✅ Save the `id` value** - This is your zone ID (in this example, it's `1`)

### Step 3: Use Zone ID When Creating Provider

Now use this zone ID when creating your provider profile:

```
POST http://localhost:9090/api/tiffin-providers
Authorization: Bearer {your_provider_token}
Content-Type: application/json

{
  "user": 2,
  "zone": 1,  // ← Use the zone ID from Step 2
  "businessName": "Tasty Tiffins",
  "description": "Home made delicious food",
  "commissionRate": 5.0,
  "providesDelivery": false,
  "deliveryRadius": null,
  "isVerified": false
}
```

---

## Alternative: Get Existing Zones

If zones already exist, you can get them:

```
GET http://localhost:9090/api/delivery-zones
Authorization: Bearer {your_admin_token}
```

**Response:**
```json
[
  {
    "id": 1,
    "zoneName": "Mumbai Central",
    "city": "Mumbai",
    "pincodeRanges": "400001,400002,400003"
  },
  {
    "id": 2,
    "zoneName": "Delhi North",
    "city": "Delhi",
    "pincodeRanges": "110001,110002"
  }
]
```

Use any existing zone `id` when creating your provider.

---

## Complete Postman Flow

### 1. Admin Login
```
POST http://localhost:9090/api/auth/login
Body: {
  "username": "admin",
  "password": "admin123"
}
```
→ Copy `token` → Set as `admin_token`

### 2. Create Zone
```
POST http://localhost:9090/api/delivery-zones
Authorization: Bearer {{admin_token}}
Body: {
  "zoneName": "Mumbai Central",
  "city": "Mumbai",
  "pincodeRanges": "400001,400002,400003"
}
```
→ Copy `id` from response → Set as `zone_id` (e.g., `1`)

### 3. Provider Signup
```
POST http://localhost:9090/api/auth/signup
Body: {
  "username": "provider1",
  "email": "provider1@test.com",
  "password": "provider123",
  "role": "ROLE_PROVIDER"
}
```
→ Copy `userId` → Set as `provider_user_id`

### 4. Provider Login
```
POST http://localhost:9090/api/auth/login
Body: {
  "username": "provider1",
  "password": "provider123"
}
```
→ Copy `token` → Set as `provider_token`

### 5. Create Provider Profile (Now with valid zone ID)
```
POST http://localhost:9090/api/tiffin-providers
Authorization: Bearer {{provider_token}}
Body: {
  "user": {{provider_user_id}},
  "zone": {{zone_id}},  // ← Use the zone ID from Step 2
  "businessName": "Tasty Tiffins",
  "description": "Home made delicious food",
  "commissionRate": 5.0,
  "providesDelivery": false,
  "deliveryRadius": null,
  "isVerified": false
}
```

**✅ This should work now!**

---

## Common Mistakes

### ❌ Wrong: Using zone ID that doesn't exist
```json
{
  "zone": 999  // Zone with ID 999 doesn't exist
}
```

### ✅ Correct: Create zone first, then use its ID
1. Create zone → Get ID (e.g., `1`)
2. Use that ID in provider creation

### ❌ Wrong: Wrong field format
```json
{
  "pincodeRanges": ["400001", "400002"]  // ❌ Array - Wrong!
}
```

### ✅ Correct: Comma-separated string
```json
{
  "pincodeRanges": "400001,400002,400003"  // ✅ String - Correct!
}
```

---

## Quick Checklist

- [ ] Admin logged in
- [ ] Delivery zone created (or existing zone ID noted)
- [ ] Zone ID saved (e.g., `zone_id = 1`)
- [ ] Provider signed up
- [ ] Provider logged in
- [ ] Provider profile created with correct zone ID

---

**That's it!** Once you have a valid zone ID, your provider creation will work.

