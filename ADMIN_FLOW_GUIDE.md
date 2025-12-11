# PlateMate Admin Flow - Complete Guide & Postman Testing

## Table of Contents

1. [Admin Flow Overview](#admin-flow-overview)
2. [Admin Registration & Login](#admin-registration--login)
3. [User Management](#user-management)
4. [Provider Management](#provider-management)
5. [Category Management](#category-management)
6. [Order Management](#order-management)
7. [Delivery Partner Management](#delivery-partner-management)
8. [Delivery Zone Management](#delivery-zone-management)
8. [Payout Management](#payout-management)
9. [Complete Postman Testing Guide](#complete-postman-testing-guide)

---

## Admin Flow Overview

### What is an Admin?

An **Admin** is a platform administrator who:
- Manages all users (customers, providers, delivery partners)
- Approves/rejects provider registrations
- Manages categories
- Views and manages all orders
- Assigns delivery partners to orders
- Manages delivery zones
- Processes payouts to providers
- Has full access to all platform data

### Admin Capabilities

| Feature | Admin Access |
|---------|-------------|
| **User Management** | ✅ Create, Read, Update, Delete all users |
| **Provider Approval** | ✅ Approve/Reject provider registrations |
| **Category Management** | ✅ Full CRUD on categories |
| **Order Management** | ✅ View all orders, assign delivery partners |
| **Delivery Partner Management** | ✅ Full CRUD on delivery partners |
| **Delivery Zone Management** | ✅ Full CRUD on delivery zones |
| **Payout Management** | ✅ Process payouts to providers |

### Admin Lifecycle

```
1. Admin Registration/Login
   ↓
2. Dashboard Overview (View stats)
   ↓
3. Manage Users
   ↓
4. Approve Providers
   ↓
5. Manage Categories
   ↓
6. Monitor Orders
   ↓
7. Assign Delivery Partners
   ↓
8. Process Payouts
```

---

## Admin Registration & Login

### Step 1: Admin Signup

**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```json
{
  "username": "admin",
  "email": "admin@platemate.com",
  "password": "admin123",
  "role": "ROLE_ADMIN"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "userId": 1,
  "username": "admin"
}
```

**Important Points:**
- Role must be `ROLE_ADMIN`
- Username and email must be unique
- First admin is typically created manually or via database

### Step 2: Admin Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin",
  "role": "ROLE_ADMIN"
}
```

**Save the token** - You'll need it for all subsequent requests.

---

## User Management

### Get All Users

**Endpoint:** `GET /api/users`

**Authorization:** `Bearer {admin_token}`

**Response:**
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@platemate.com",
    "role": "ROLE_ADMIN"
  },
  {
    "id": 2,
    "username": "customer1",
    "email": "customer1@test.com",
    "role": "ROLE_CUSTOMER"
  },
  {
    "id": 3,
    "username": "provider1",
    "email": "provider1@test.com",
    "role": "ROLE_PROVIDER"
  }
]
```

### Get User by ID

**Endpoint:** `GET /api/users/{id}`

**Authorization:** `Bearer {admin_token}`

**Response:**
```json
{
  "id": 2,
  "username": "customer1",
  "email": "customer1@test.com",
  "role": "ROLE_CUSTOMER",
  "phoneNumber": "1234567890"
}
```

### Create User

**Endpoint:** `POST /api/users`

**Authorization:** `Bearer {admin_token}`

**Request Body:**
```json
{
  "username": "newuser",
  "email": "newuser@test.com",
  "password": "password123",
  "role": "ROLE_CUSTOMER"
}
```

**Response:**
```json
{
  "id": 4,
  "username": "newuser",
  "email": "newuser@test.com",
  "role": "ROLE_CUSTOMER"
}
```

### Update User

**Endpoint:** `PUT /api/users/{id}`

**Authorization:** `Bearer {admin_token}`

**Request Body:**
```json
{
  "username": "updateduser",
  "email": "updated@test.com",
  "phoneNumber": "9876543210"
}
```

**Response:**
```json
{
  "id": 2,
  "username": "updateduser",
  "email": "updated@test.com",
  "phoneNumber": "9876543210"
}
```

### Delete User

**Endpoint:** `DELETE /api/users/{id}`

**Authorization:** `Bearer {admin_token}`

**Response:** `204 No Content`

**Note:** This is a soft delete - user is marked as deleted but not removed from database.

---

## Provider Management

### Get All Providers

**Endpoint:** `GET /api/tiffin-providers`

**Authorization:** `Bearer {admin_token}`

**Response:**
```json
[
  {
    "id": 1,
    "businessName": "Tasty Tiffins",
    "description": "Home made food",
    "isVerified": true,
    "user": {
      "id": 3,
      "username": "provider1"
    }
  }
]
```

### Get Pending Providers

**Endpoint:** `GET /api/admin/providers/pending`

**Authorization:** `Bearer {admin_token}`

**Response:**
```json
[
  {
    "id": 2,
    "businessName": "New Restaurant",
    "description": "Just registered",
    "isVerified": false,
    "user": {
      "id": 4,
      "username": "provider2"
    }
  }
]
```

**Use Case:** View all providers waiting for approval

### Approve Provider

**Endpoint:** `POST /api/admin/providers/{providerId}/approve`

**Authorization:** `Bearer {admin_token}`

**Response:**
```json
{
  "id": 2,
  "businessName": "New Restaurant",
  "isVerified": true,  // ✅ Changed to true
  "user": {
    "id": 4,
    "username": "provider2"
  }
}
```

**What Happens:**
- `isVerified` changes from `false` to `true`
- Provider can now create menu items
- Provider can receive orders

### Reject Provider

**Endpoint:** `POST /api/admin/providers/{providerId}/reject`

**Authorization:** `Bearer {admin_token}`

**Response:**
```json
{
  "id": 2,
  "isVerified": false,
  "isDeleted": true  // Provider is soft-deleted
}
```

**What Happens:**
- Provider is soft-deleted
- Provider cannot access the platform
- Provider cannot create menu items

### Get Provider by ID

**Endpoint:** `GET /api/tiffin-providers/{id}`

**Authorization:** `Bearer {admin_token}`

**Response:**
```json
{
  "id": 1,
  "businessName": "Tasty Tiffins",
  "description": "Home made food",
  "isVerified": true,
  "commissionRate": 5.0,
  "user": {
    "id": 3,
    "username": "provider1"
  }
}
```

### Update Provider

**Endpoint:** `PUT /api/tiffin-providers/{id}`

**Authorization:** `Bearer {admin_token}`

**Request Body:**
```json
{
  "businessName": "Updated Restaurant Name",
  "description": "Updated description",
  "commissionRate": 6.0
}
```

### Delete Provider

**Endpoint:** `DELETE /api/tiffin-providers/{id}`

**Authorization:** `Bearer {admin_token}`

**Response:** `204 No Content`

---

## Category Management

### Get All Categories

**Endpoint:** `GET /api/categories`

**Authorization:** `Bearer {admin_token}`

**Response:**
```json
[
  {
    "id": 1,
    "categoryName": "North Indian",
    "description": "Traditional North Indian cuisine"
  },
  {
    "id": 2,
    "categoryName": "South Indian",
    "description": "Traditional South Indian dishes"
  }
]
```

### Get Category by ID

**Endpoint:** `GET /api/categories/{id}`

**Authorization:** `Bearer {admin_token}`

**Response:**
```json
{
  "id": 1,
  "categoryName": "North Indian",
  "description": "Traditional North Indian cuisine"
}
```

### Create Category

**Endpoint:** `POST /api/categories`

**Authorization:** `Bearer {admin_token}`

**Request Body:**
```json
{
  "categoryName": "Chinese",
  "description": "Chinese cuisine and dishes"
}
```

**Response:**
```json
{
  "id": 3,
  "categoryName": "Chinese",
  "description": "Chinese cuisine and dishes"
}
```

### Update Category

**Endpoint:** `PUT /api/categories/{id}`

**Authorization:** `Bearer {admin_token}`

**Request Body:**
```json
{
  "categoryName": "Updated Category Name",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "id": 1,
  "categoryName": "Updated Category Name",
  "description": "Updated description"
}
```

### Delete Category

**Endpoint:** `DELETE /api/categories/{id}`

**Authorization:** `Bearer {admin_token}`

**Response:** `204 No Content`

**Note:** This is a soft delete - category is marked as deleted but not removed.

---

## Order Management

### Get All Orders

**Endpoint:** `GET /api/admin/orders`

**Authorization:** `Bearer {admin_token}`

**Response:**
```json
[
  {
    "id": 1,
    "customerId": 2,
    "providerId": 1,
    "providerName": "Tasty Tiffins",
    "orderStatus": "READY",
    "subtotal": 420.0,
    "deliveryFee": 30.0,
    "platformCommission": 21.0,
    "totalAmount": 471.0,
    "deliveryAddress": "123 Main Street, Mumbai",
    "orderTime": "2024-01-15T12:00:00",
    "estimatedDeliveryTime": "2024-01-15T13:00:00",
    "deliveryPartnerId": null,
    "cartItems": [...]
  }
]
```

**Use Case:** View all orders across all customers and providers

### Assign Delivery Partner to Order

**Endpoint:** `POST /api/admin/orders/{orderId}/assign-delivery/{deliveryPartnerId}`

**Authorization:** `Bearer {admin_token}`

**Prerequisites:**
- Order status must be `READY`
- Delivery partner must exist
- Delivery partner must have `isAvailable = true`

**Response:**
```json
{
  "id": 1,
  "orderStatus": "OUT_FOR_DELIVERY",  // ✅ Status changed
  "deliveryPartnerId": 1,
  "deliveryPartnerName": "Rajesh Kumar",
  "totalAmount": 471.0
}
```

**What Happens:**
- Order status changes from `READY` to `OUT_FOR_DELIVERY`
- Delivery partner is assigned to the order
- Delivery partner can now see and manage this order

---

## Delivery Partner Management

### Get All Delivery Partners

**Endpoint:** `GET /api/delivery-partners`

**Authorization:** `Bearer {admin_token}`

**Response:**
```json
[
  {
    "id": 1,
    "userId": 5,
    "fullName": "Rajesh Kumar",
    "vehicleType": "BIKE",
    "commissionRate": 10.00,
    "serviceArea": "Mumbai Central, Andheri",
    "isAvailable": true
  }
]
```

### Get Delivery Partner by ID

**Endpoint:** `GET /api/delivery-partners/{id}`

**Authorization:** `Bearer {admin_token}`

**Response:**
```json
{
  "id": 1,
  "userId": 5,
  "fullName": "Rajesh Kumar",
  "vehicleType": "BIKE",
  "commissionRate": 10.00,
  "serviceArea": "Mumbai Central, Andheri",
  "isAvailable": true
}
```

### Create Delivery Partner

**Endpoint:** `POST /api/delivery-partners`

**Authorization:** `Bearer {admin_token}`

**Request Body:**
```json
{
  "userId": 5,
  "fullName": "Rajesh Kumar",
  "vehicleType": "BIKE",
  "commissionRate": 10.00,
  "serviceArea": "Mumbai Central, Andheri, Bandra"
}
```

**Field Explanations:**
- `userId`: User ID (user must exist with DELIVERY_PARTNER role)
- `fullName`: Full name of delivery partner
- `vehicleType`: `BIKE`, `SCOOTER`, `BICYCLE`, or `CAR`
- `commissionRate`: Commission percentage per delivery
- `serviceArea`: Areas where delivery partner operates

**Response:**
```json
{
  "id": 1,
  "userId": 5,
  "fullName": "Rajesh Kumar",
  "vehicleType": "BIKE",
  "commissionRate": 10.00,
  "serviceArea": "Mumbai Central, Andheri, Bandra",
  "isAvailable": false
}
```

### Update Delivery Partner

**Endpoint:** `PUT /api/delivery-partners/{id}`

**Authorization:** `Bearer {admin_token}`

**Request Body:**
```json
{
  "fullName": "Rajesh Kumar",
  "vehicleType": "BIKE",
  "commissionRate": 12.00,
  "serviceArea": "Mumbai Central, Andheri, Bandra, Powai",
  "isAvailable": true
}
```

**Response:**
```json
{
  "id": 1,
  "fullName": "Rajesh Kumar",
  "vehicleType": "BIKE",
  "commissionRate": 12.00,
  "serviceArea": "Mumbai Central, Andheri, Bandra, Powai",
  "isAvailable": true
}
```

### Delete Delivery Partner

**Endpoint:** `DELETE /api/delivery-partners/{id}`

**Authorization:** `Bearer {admin_token}`

**Response:** `204 No Content`

**Note:** This is a soft delete.

---

## Delivery Zone Management

### Get All Delivery Zones

**Endpoint:** `GET /api/delivery-zones`

**Authorization:** `Bearer {admin_token}`

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

### Get Zone by ID

**Endpoint:** `GET /api/delivery-zones/{id}`

**Authorization:** `Bearer {admin_token}`

**Response:**
```json
{
  "id": 1,
  "zoneName": "Mumbai Central",
  "city": "Mumbai",
  "pincodeRanges": "400001,400002,400003"
}
```

### Create Delivery Zone

**Endpoint:** `POST /api/delivery-zones`

**Authorization:** `Bearer {admin_token}`

**Request Body:**
```json
{
  "zoneName": "Mumbai Central",
  "city": "Mumbai",
  "pincodeRanges": "400001,400002,400003"
}
```

**Field Explanations:**
- `zoneName`: Name of the delivery zone
- `city`: City name
- `pincodeRanges`: Comma-separated pincodes as a string

**Response:**
```json
{
  "id": 1,
  "zoneName": "Mumbai Central",
  "city": "Mumbai",
  "pincodeRanges": "400001,400002,400003"
}
```

**Important:** Zones are required when creating provider profiles.

### Update Delivery Zone

**Endpoint:** `PUT /api/delivery-zones/{id}`

**Authorization:** `Bearer {admin_token}`

**Request Body:**
```json
{
  "zoneName": "Updated Zone Name",
  "city": "Mumbai",
  "pincodeRanges": "400001,400002,400003,400004"
}
```

### Delete Delivery Zone

**Endpoint:** `DELETE /api/delivery-zones/{id}`

**Authorization:** `Bearer {admin_token}`

**Response:** `204 No Content`

### Assign Zone to Provider

**Endpoint:** `POST /api/delivery-zones/{zoneId}/assign/{providerId}`

**Authorization:** `Bearer {admin_token}`

**Response:**
```json
{
  "id": 1,
  "businessName": "Tasty Tiffins",
  "zone": {
    "id": 1,
    "zoneName": "Mumbai Central"
  }
}
```

**Use Case:** Change provider's delivery zone

---




## Payout Management

### Run Payout for Provider

**Endpoint:** `POST /api/admin/payouts/run/{providerId}`

**Authorization:** `Bearer {admin_token}`

**Request Body:**
```json
{
  "from": "2024-01-01T00:00:00",
  "to": "2024-01-31T23:59:59"
}
```

**Field Explanations:**
- `from`: Start date for payout period (optional)
- `to`: End date for payout period (optional)
- If both are null, calculates for all time

**Response:**
```json
{
  "id": 1,
  "providerId": 1,
  "amount": 5000.00,
  "status": "PENDING",
  "reference": "prov-1-1705315200000",
  "createdAt": "2024-01-15T10:00:00"
}
```

**What Happens:**
- Calculates provider's earnings for the period
- Deducts platform commission
- Creates payout record
- Provider receives net payable amount

---

## Complete Postman Testing Guide

### Prerequisites

1. **Postman Environment Setup**
   - Create environment: "PlateMate Local"
   - Variables:
     - `base_url`: `http://localhost:9090`
     - `admin_token`: (set after admin login)
     - `admin_user_id`: (set after admin signup)
     - `user_id`: (for testing user management)
     - `provider_id`: (for testing provider approval)
     - `category_id`: (for testing category management)
     - `order_id`: (for testing order assignment)
     - `delivery_partner_id`: (for testing delivery partner management)
     - `zone_id`: (for testing zone management)

2. **Setup Required** (Do these first):
   - Admin user exists
   - At least one provider exists (for approval testing)
   - At least one order exists with status `READY` (for assignment testing)

---

## Step-by-Step Postman Testing

### Phase 1: Admin Setup

#### Step 1.1: Admin Signup
```
POST {{base_url}}/api/auth/signup
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@platemate.com",
  "password": "admin123",
  "role": "ROLE_ADMIN"
}
```

**Expected Response:**
```json
{
  "message": "User created successfully",
  "userId": 1,
  "username": "admin"
}
```

**Action:** Save `userId` → Set `admin_user_id` = 1

#### Step 1.2: Admin Login
```
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "...",
  "username": "admin",
  "role": "ROLE_ADMIN"
}
```

**Action:** Copy `token` → Set `admin_token`

---

### Phase 2: User Management

#### Step 2.1: Get All Users
```
GET {{base_url}}/api/users
Authorization: Bearer {{admin_token}}
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@platemate.com",
    "role": "ROLE_ADMIN"
  }
]
```

#### Step 2.2: Create User
```
POST {{base_url}}/api/users
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "username": "testuser",
  "email": "testuser@test.com",
  "password": "password123",
  "role": "ROLE_CUSTOMER"
}
```

**Expected Response:**
```json
{
  "id": 2,
  "username": "testuser",
  "email": "testuser@test.com",
  "role": "ROLE_CUSTOMER"
}
```

**Action:** Save `id` → Set `user_id` = 2

#### Step 2.3: Get User by ID
```
GET {{base_url}}/api/users/{{user_id}}
Authorization: Bearer {{admin_token}}
```

#### Step 2.4: Update User
```
PUT {{base_url}}/api/users/{{user_id}}
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "username": "updateduser",
  "email": "updated@test.com",
  "phoneNumber": "1234567890"
}
```

#### Step 2.5: Delete User
```
DELETE {{base_url}}/api/users/{{user_id}}
Authorization: Bearer {{admin_token}}
```

**Expected Response:** `204 No Content`

---

### Phase 3: Provider Management

#### Step 3.1: Get All Providers
```
GET {{base_url}}/api/tiffin-providers
Authorization: Bearer {{admin_token}}
```

#### Step 3.2: Get Pending Providers
```
GET {{base_url}}/api/admin/providers/pending
Authorization: Bearer {{admin_token}}
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "businessName": "New Restaurant",
    "isVerified": false
  }
]
```

**Action:** Save provider `id` → Set `provider_id` = 1

#### Step 3.3: Approve Provider
```
POST {{base_url}}/api/admin/providers/{{provider_id}}/approve
Authorization: Bearer {{admin_token}}
```

**Expected Response:**
```json
{
  "id": 1,
  "businessName": "New Restaurant",
  "isVerified": true  // ✅ Changed to true
}
```

**✅ Provider is now approved!**

#### Step 3.4: Reject Provider (Alternative)
```
POST {{base_url}}/api/admin/providers/{{provider_id}}/reject
Authorization: Bearer {{admin_token}}
```

---

### Phase 4: Category Management

#### Step 4.1: Get All Categories
```
GET {{base_url}}/api/categories
Authorization: Bearer {{admin_token}}
```

#### Step 4.2: Create Category
```
POST {{base_url}}/api/categories
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "categoryName": "Chinese",
  "description": "Chinese cuisine and dishes"
}
```

**Expected Response:**
```json
{
  "id": 1,
  "categoryName": "Chinese",
  "description": "Chinese cuisine and dishes"
}
```

**Action:** Save `id` → Set `category_id` = 1

#### Step 4.3: Update Category
```
PUT {{base_url}}/api/categories/{{category_id}}
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "categoryName": "Updated Category",
  "description": "Updated description"
}
```

#### Step 4.4: Delete Category
```
DELETE {{base_url}}/api/categories/{{category_id}}
Authorization: Bearer {{admin_token}}
```

**Expected Response:** `204 No Content`

---

### Phase 5: Delivery Zone Management

#### Step 5.1: Get All Zones
```
GET {{base_url}}/api/delivery-zones
Authorization: Bearer {{admin_token}}
```

#### Step 5.2: Create Zone
```
POST {{base_url}}/api/delivery-zones
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "zoneName": "Mumbai Central",
  "city": "Mumbai",
  "pincodeRanges": "400001,400002,400003"
}
```

**Expected Response:**
```json
{
  "id": 1,
  "zoneName": "Mumbai Central",
  "city": "Mumbai",
  "pincodeRanges": "400001,400002,400003"
}
```

**Action:** Save `id` → Set `zone_id` = 1

#### Step 5.3: Update Zone
```
PUT {{base_url}}/api/delivery-zones/{{zone_id}}
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "zoneName": "Updated Zone",
  "city": "Mumbai",
  "pincodeRanges": "400001,400002,400003,400004"
}
```

#### Step 5.4: Assign Zone to Provider
```
POST {{base_url}}/api/delivery-zones/{{zone_id}}/assign/{{provider_id}}
Authorization: Bearer {{admin_token}}
```

---

### Phase 6: Delivery Partner Management

#### Step 6.1: Get All Delivery Partners
```
GET {{base_url}}/api/delivery-partners
Authorization: Bearer {{admin_token}}
```

#### Step 6.2: Create Delivery Partner
```
POST {{base_url}}/api/delivery-partners
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "userId": 5,
  "fullName": "Rajesh Kumar",
  "vehicleType": "BIKE",
  "commissionRate": 10.00,
  "serviceArea": "Mumbai Central, Andheri"
}
```

**Expected Response:**
```json
{
  "id": 1,
  "userId": 5,
  "fullName": "Rajesh Kumar",
  "vehicleType": "BIKE",
  "commissionRate": 10.00,
  "serviceArea": "Mumbai Central, Andheri",
  "isAvailable": false
}
```

**Action:** Save `id` → Set `delivery_partner_id` = 1

#### Step 6.3: Update Delivery Partner
```
PUT {{base_url}}/api/delivery-partners/{{delivery_partner_id}}
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "fullName": "Rajesh Kumar",
  "vehicleType": "BIKE",
  "commissionRate": 12.00,
  "serviceArea": "Mumbai Central, Andheri, Bandra",
  "isAvailable": true
}
```

#### Step 6.4: Delete Delivery Partner
```
DELETE {{base_url}}/api/delivery-partners/{{delivery_partner_id}}
Authorization: Bearer {{admin_token}}
```

---

### Phase 7: Order Management

#### Step 7.1: Get All Orders
```
GET {{base_url}}/api/admin/orders
Authorization: Bearer {{admin_token}}
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "orderStatus": "READY",
    "totalAmount": 471.0,
    "deliveryPartnerId": null
  }
]
```

**Action:** Find order with `orderStatus: "READY"` → Set `order_id` = 1

#### Step 7.2: Assign Delivery Partner
```
POST {{base_url}}/api/admin/orders/{{order_id}}/assign-delivery/{{delivery_partner_id}}
Authorization: Bearer {{admin_token}}
```

**Expected Response:**
```json
{
  "id": 1,
  "orderStatus": "OUT_FOR_DELIVERY",
  "deliveryPartnerId": 1,
  "deliveryPartnerName": "Rajesh Kumar"
}
```

**✅ Order assigned to delivery partner!**

---

### Phase 8: Payout Management

#### Step 8.1: Run Payout for Provider
```
POST {{base_url}}/api/admin/payouts/run/{{provider_id}}
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "from": "2024-01-01T00:00:00",
  "to": "2024-01-31T23:59:59"
}
```

**Expected Response:**
```json
{
  "id": 1,
  "providerId": 1,
  "amount": 5000.00,
  "status": "PENDING",
  "reference": "prov-1-1705315200000"
}
```

**✅ Payout created!**

---

## Complete Testing Flow Summary

### ✅ Admin Setup
1. ✅ Signup admin user
2. ✅ Login admin
3. ✅ Save admin token

### ✅ User Management
4. ✅ Get all users
5. ✅ Create user
6. ✅ Get user by ID
7. ✅ Update user
8. ✅ Delete user

### ✅ Provider Management
9. ✅ Get all providers
10. ✅ Get pending providers
11. ✅ Approve provider
12. ✅ Reject provider (optional)

### ✅ Category Management
13. ✅ Get all categories
14. ✅ Create category
15. ✅ Update category
16. ✅ Delete category

### ✅ Delivery Zone Management
17. ✅ Get all zones
18. ✅ Create zone
19. ✅ Update zone
20. ✅ Assign zone to provider

### ✅ Delivery Partner Management
21. ✅ Get all delivery partners
22. ✅ Create delivery partner
23. ✅ Update delivery partner
24. ✅ Delete delivery partner

### ✅ Order Management
25. ✅ Get all orders
26. ✅ Assign delivery partner to order

### ✅ Payout Management
27. ✅ Run payout for provider

---

## Common Errors & Solutions

### Error 1: "Full authentication is required"
**Cause:** Missing or invalid token  
**Solution:** Login again and get fresh token

### Error 2: "Access Denied"
**Cause:** User doesn't have ADMIN role  
**Solution:** Verify user role is `ROLE_ADMIN`

### Error 3: "Order must be in READY status to assign delivery partner"
**Cause:** Trying to assign order that's not ready  
**Solution:** Wait for provider to mark order as `READY` first

### Error 4: "Delivery partner is not available"
**Cause:** Trying to assign to unavailable partner  
**Solution:** Set delivery partner `isAvailable = true` first

### Error 5: "Zone not found"
**Cause:** Zone ID doesn't exist  
**Solution:** Create zone first or use existing zone ID

---

## Admin Dashboard APIs Summary

For building an admin panel in React, you'll need:

```javascript
// Dashboard Stats
GET    /api/users                 // All users count
GET    /api/tiffin-providers      // All providers count
GET    /api/admin/orders          // All orders
GET    /api/admin/providers/pending  // Pending approvals count

// User Management
GET    /api/users                 // List all users
GET    /api/users/{id}            // Get user details
POST   /api/users                 // Create user
PUT    /api/users/{id}            // Update user
DELETE /api/users/{id}            // Delete user

// Provider Management
GET    /api/tiffin-providers      // All providers
GET    /api/admin/providers/pending  // Pending providers
POST   /api/admin/providers/{id}/approve  // Approve provider
POST   /api/admin/providers/{id}/reject   // Reject provider
PUT    /api/tiffin-providers/{id}  // Update provider
DELETE /api/tiffin-providers/{id}  // Delete provider

// Category Management
GET    /api/categories            // All categories
POST   /api/categories           // Create category
PUT    /api/categories/{id}      // Update category
DELETE /api/categories/{id}     // Delete category

// Order Management
GET    /api/admin/orders          // All orders
POST   /api/admin/orders/{orderId}/assign-delivery/{deliveryPartnerId}  // Assign delivery

// Delivery Partner Management
GET    /api/delivery-partners     // All delivery partners
POST   /api/delivery-partners     // Create delivery partner
PUT    /api/delivery-partners/{id}  // Update delivery partner
DELETE /api/delivery-partners/{id}  // Delete delivery partner

// Delivery Zone Management
GET    /api/delivery-zones        // All zones
POST   /api/delivery-zones        // Create zone
PUT    /api/delivery-zones/{id}   // Update zone
DELETE /api/delivery-zones/{id}   // Delete zone
POST   /api/delivery-zones/{zoneId}/assign/{providerId}  // Assign zone

// Payout Management
POST   /api/admin/payouts/run/{providerId}  // Run payout
```

---

## Admin Dashboard Features

### Dashboard Overview
- Total users count
- Total providers count
- Pending provider approvals
- Total orders (today/week/month)
- Revenue statistics
- Active delivery partners

### User Management Page
- List all users with filters
- Search users
- Create new users
- Edit user details
- Delete users
- View user profiles

### Provider Management Page
- List all providers
- View pending providers
- Approve/reject providers
- Edit provider details
- View provider menu items
- View provider orders

### Category Management Page
- List all categories
- Create new category
- Edit category
- Delete category

### Order Management Page
- List all orders
- Filter by status
- View order details
- Assign delivery partners
- Track order status

### Delivery Partner Management Page
- List all delivery partners
- Create delivery partner
- Update availability
- View assigned orders
- Delete delivery partner

### Delivery Zone Management Page
- List all zones
- Create new zone
- Edit zone
- Assign zones to providers
- Delete zone

### Payout Management Page
- View provider earnings
- Process payouts
- View payout history
- Filter by date range

---

## Testing Checklist

### Admin Setup
- [ ] Signup admin user
- [ ] Login admin
- [ ] Verify admin token works

### User Management
- [ ] Get all users
- [ ] Create user
- [ ] Get user by ID
- [ ] Update user
- [ ] Delete user

### Provider Management
- [ ] Get all providers
- [ ] Get pending providers
- [ ] Approve provider
- [ ] Reject provider

### Category Management
- [ ] Get all categories
- [ ] Create category
- [ ] Update category
- [ ] Delete category

### Delivery Zone Management
- [ ] Get all zones
- [ ] Create zone
- [ ] Update zone
- [ ] Assign zone to provider
- [ ] Delete zone

### Delivery Partner Management
- [ ] Get all delivery partners
- [ ] Create delivery partner
- [ ] Update delivery partner
- [ ] Delete delivery partner

### Order Management
- [ ] Get all orders
- [ ] Assign delivery partner

### Payout Management
- [ ] Run payout for provider

---

## Complete Example Request/Response

### Approve Provider
**Request:**
```json
POST /api/admin/providers/1/approve
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "id": 1,
  "businessName": "Tasty Tiffins",
  "isVerified": true
}
```

### Assign Delivery Partner
**Request:**
```json
POST /api/admin/orders/1/assign-delivery/1
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "id": 1,
  "orderStatus": "OUT_FOR_DELIVERY",
  "deliveryPartnerId": 1,
  "deliveryPartnerName": "Rajesh Kumar"
}
```

### Create Category
**Request:**
```json
POST /api/categories
Authorization: Bearer {admin_token}

{
  "categoryName": "Chinese",
  "description": "Chinese cuisine"
}
```

**Response:**
```json
{
  "id": 1,
  "categoryName": "Chinese",
  "description": "Chinese cuisine"
}
```

---

This guide provides complete understanding of admin flow. Test each step in Postman to understand the data flow before building your admin panel in React.

