# PlateMate Delivery Partner Flow - Complete Guide & Postman Testing

## Table of Contents

1. [Delivery Partner Flow Overview](#delivery-partner-flow-overview)
2. [Delivery Partner Registration & Profile Creation](#delivery-partner-registration--profile-creation)
3. [Availability Management](#availability-management)
4. [Order Assignment Process](#order-assignment-process)
5. [Order Delivery Management](#order-delivery-management)
6. [Complete Postman Testing Guide](#complete-postman-testing-guide)

---

## Delivery Partner Flow Overview

### What is a Delivery Partner?

A **Delivery Partner** is a person who:

- Delivers food orders from providers to customers
- Gets assigned orders by admin when order status is `READY`
- Updates order status as they pick up and deliver
- Earns commission on each delivery

### Delivery Partner Lifecycle

```
1. User Registration (DELIVERY_PARTNER role)
   ↓
2. Create Delivery Partner Profile
   ↓
3. Set Availability (isAvailable = true)
   ↓
4. Admin Assigns Orders (when order status = READY)
   ↓
5. Update Order Status (OUT_FOR_DELIVERY → DELIVERED)
   ↓
6. Complete Delivery
```

### Key Delivery Partner States

| State           | Description           | Can Receive Orders? |
| --------------- | --------------------- | ------------------- |
| **Unavailable** | `isAvailable = false` | ❌ No               |
| **Available**   | `isAvailable = true`  | ✅ Yes              |
| **Deleted**     | `isDeleted = true`    | ❌ No               |

### Order Status Flow (Delivery Partner Perspective)

```
READY (Provider marks order ready)
   ↓
[Admin assigns to Delivery Partner]
   ↓
OUT_FOR_DELIVERY (Delivery Partner picks up)
   ↓
DELIVERED (Delivery Partner completes delivery)
```

---

## Delivery Partner Registration & Profile Creation

### Step 1: User Registration

**Endpoint:** `POST /api/auth/signup`

**Request Body:**

```json
{
  "username": "delivery1",
  "email": "delivery1@test.com",
  "password": "delivery123",
  "role": "DELIVERY_PARTNER"
}
```

**Response:**

```json
{
  "message": "User created successfully",
  "userId": 3,
  "username": "delivery1"
}
```

**Important Points:**

- Role must be `DELIVERY_PARTNER` (not `ROLE_DELIVERY_PARTNER`)
- Username and email must be unique
- Password will be encrypted automatically

### Step 2: Login as Delivery Partner

**Endpoint:** `POST /api/auth/login`

**Request Body:**

```json
{
  "username": "delivery1",
  "password": "delivery123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "delivery1",
  "role": "DELIVERY_PARTNER"
}
```

**Save the token** - You'll need it for all subsequent requests.

### Step 3: Create Delivery Partner Profile

**Endpoint:** `POST /api/delivery-partners`

**Authorization:** `Bearer {delivery_partner_token}`

**Request Body:**

```json
{
  "userId": 3,
  "fullName": "Rajesh Kumar",
  "vehicleType": "BIKE",
  "commissionRate": 10.0,
  "serviceArea": "Mumbai Central, Andheri, Bandra"
}
```

**Field Explanations:**

- `userId`: User ID from registration (Step 1)
- `fullName`: Full name of the delivery partner
- `vehicleType`: Vehicle type - must be one of:
  - `BIKE` - Motorcycle
  - `SCOOTER` - Scooter
  - `BICYCLE` - Bicycle
  - `CAR` - Car
- `commissionRate`: Commission percentage per delivery (e.g., 10.00 = 10%)
- `serviceArea`: Areas where delivery partner operates (comma-separated string)

**Response:**

```json
{
  "id": 1,
  "userId": 3,
  "fullName": "Rajesh Kumar",
  "vehicleType": "BIKE",
  "commissionRate": 10.0,
  "serviceArea": "Mumbai Central, Andheri, Bandra",
  "isAvailable": false
}
```

**Important:**

- `isAvailable` defaults to `false` - must be set to `true` to receive orders
- Delivery partner can create their own profile or admin can create it

---

## Availability Management

### Why Availability Matters?

- Only **available** delivery partners can be assigned orders
- Admin can only assign orders to partners with `isAvailable = true`
- Delivery partner can toggle availability based on their schedule

### Update Availability

**Endpoint:** `PUT /api/delivery-partners/{id}`

**Authorization:** `Bearer {delivery_partner_token}` or `Bearer {admin_token}`

**Request Body:**

```json
{
  "fullName": "Rajesh Kumar",
  "vehicleType": "BIKE",
  "commissionRate": 10.0,
  "serviceArea": "Mumbai Central, Andheri, Bandra",
  "isAvailable": true
}
```

**Response:**

```json
{
  "id": 1,
  "fullName": "Rajesh Kumar",
  "vehicleType": "BIKE",
  "isAvailable": true // ✅ Now available
}
```

**Use Cases:**

- Set `isAvailable: true` when starting work
- Set `isAvailable: false` when going offline/ending shift

---

## Order Assignment Process

### How Orders Get Assigned?

1. **Customer** places order → Status: `PENDING`
2. **Provider** confirms order → Status: `CONFIRMED`
3. **Provider** prepares food → Status: `PREPARING`
4. **Provider** marks ready → Status: `READY`
5. **Admin** assigns delivery partner → Status: `OUT_FOR_DELIVERY`
6. **Delivery Partner** delivers → Status: `DELIVERED`

### Admin Assigns Order to Delivery Partner

**Endpoint:** `POST /api/admin/orders/{orderId}/assign-delivery/{deliveryPartnerId}`

**Authorization:** `Bearer {admin_token}`

**Prerequisites:**

- Order status must be `READY`
- Delivery partner must exist
- Delivery partner must have `isAvailable = true`
- Delivery partner must not be deleted

**Request Example:**

```
POST /api/admin/orders/1/assign-delivery/1
Authorization: Bearer {admin_token}
```

**Response:**

```json
{
  "id": 1,
  "orderStatus": "OUT_FOR_DELIVERY",  // ✅ Status changed
  "deliveryPartnerId": 1,
  "deliveryPartnerName": "Rajesh Kumar",
  "totalAmount": 345.00,
  "cartItems": [...]
}
```

**What Happens:**

- Order status changes from `READY` to `OUT_FOR_DELIVERY`
- Delivery partner is assigned to the order
- Delivery partner can now see and manage this order

---

## Order Delivery Management

### View All Assigned Orders

**Endpoint:** `GET /api/delivery-partners/orders`

**Authorization:** `Bearer {delivery_partner_token}`

**Response:**

```json
[
  {
    "id": 1,
    "customerId": 2,
    "providerId": 1,
    "providerName": "Tasty Tiffins",
    "orderStatus": "OUT_FOR_DELIVERY",
    "deliveryPartnerId": 1,
    "deliveryPartnerName": "Rajesh Kumar",
    "totalAmount": 345.0,
    "deliveryAddress": {
      "street": "123 Customer St",
      "city": "Mumbai",
      "pincode": "400001"
    },
    "orderTime": "2024-01-15T12:00:00",
    "estimatedDeliveryTime": "2024-01-15T13:00:00"
  }
]
```

### View Order Details

**Endpoint:** `GET /api/delivery-partners/orders/{id}`

**Authorization:** `Bearer {delivery_partner_token}`

**Response:** Same as above but for single order.

### Update Delivery Status

**Endpoint:** `PUT /api/delivery-partners/orders/{id}/status`

**Authorization:** `Bearer {delivery_partner_token}`

**Valid Status Transitions:**

- `OUT_FOR_DELIVERY` → `DELIVERED` ✅
- Cannot update to any other status ❌

**Request Body:**

```json
{
  "orderStatus": "DELIVERED"
}
```

**Response:**

```json
{
  "id": 1,
  "orderStatus": "DELIVERED", // ✅ Status updated
  "deliveryTime": "2024-01-15T13:30:00", // ✅ Delivery time set
  "totalAmount": 345.0
}
```

**What Happens:**

- Order status changes to `DELIVERED`
- `deliveryTime` is automatically set to current timestamp
- Order is marked as completed

---

## Complete Postman Testing Guide

### Prerequisites

1. **Postman Environment Setup**

   - Create environment: "PlateMate Local"
   - Variables:
     - `base_url`: `http://localhost:9090`
     - `admin_token`: (set after admin login)
     - `delivery_token`: (set after delivery partner login)
     - `delivery_user_id`: (set after delivery partner signup)
     - `delivery_partner_id`: (set after creating profile)
     - `order_id`: (set after order is created and ready)

2. **Setup Required** (Do these first):
   - Admin user exists
   - At least one order exists with status `READY`

---

## Step-by-Step Postman Testing

### Phase 1: Delivery Partner Registration

#### Step 1.1: Delivery Partner Signup

```
POST {{base_url}}/api/auth/signup
Content-Type: application/json

{
  "username": "delivery1",
  "email": "delivery1@test.com",
  "password": "delivery123",
  "role": "DELIVERY_PARTNER"
}
```

**Expected Response:**

```json
{
  "message": "User created successfully",
  "userId": 3,
  "username": "delivery1"
}
```

**Action:** Save `userId` → Set `delivery_user_id` = 3

#### Step 1.2: Delivery Partner Login

```
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "username": "delivery1",
  "password": "delivery123"
}
```

**Expected Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "...",
  "username": "delivery1",
  "role": "DELIVERY_PARTNER"
}
```

**Action:** Copy `token` → Set `delivery_token`

#### Step 1.3: Create Delivery Partner Profile

```
POST {{base_url}}/api/delivery-partners
Authorization: Bearer {{delivery_token}}
Content-Type: application/json

{
  "userId": {{delivery_user_id}},
  "fullName": "Rajesh Kumar",
  "vehicleType": "BIKE",
  "commissionRate": 10.00,
  "serviceArea": "Mumbai Central, Andheri, Bandra"
}
```

**Expected Response:**

```json
{
  "id": 1,
  "userId": 3,
  "fullName": "Rajesh Kumar",
  "vehicleType": "BIKE",
  "commissionRate": 10.0,
  "serviceArea": "Mumbai Central, Andheri, Bandra",
  "isAvailable": false
}
```

**Action:** Save `id` → Set `delivery_partner_id` = 1

**⚠️ Important:** `isAvailable = false` by default. Must set to `true` to receive orders.

---

### Phase 2: Availability Management

#### Step 2.1: Set Availability to True

```
PUT {{base_url}}/api/delivery-partners/{{delivery_partner_id}}
Authorization: Bearer {{delivery_token}}
Content-Type: application/json

{
  "fullName": "Rajesh Kumar",
  "vehicleType": "BIKE",
  "commissionRate": 10.00,
  "serviceArea": "Mumbai Central, Andheri, Bandra",
  "isAvailable": true
}
```

**Expected Response:**

```json
{
  "id": 1,
  "fullName": "Rajesh Kumar",
  "isAvailable": true // ✅ Now available
}
```

**✅ Delivery partner is now available to receive orders!**

#### Step 2.2: Get All Delivery Partners (Admin View)

```
GET {{base_url}}/api/delivery-partners
Authorization: Bearer {{admin_token}}
```

**Expected Response:**

```json
[
  {
    "id": 1,
    "fullName": "Rajesh Kumar",
    "vehicleType": "BIKE",
    "isAvailable": true
  }
]
```

#### Step 2.3: Get Delivery Partner by ID

```
GET {{base_url}}/api/delivery-partners/{{delivery_partner_id}}
Authorization: Bearer {{delivery_token}}
```

---

### Phase 3: Order Assignment (Admin Action)

**Prerequisites:**

- An order must exist with status `READY`
- Delivery partner must have `isAvailable = true`

#### Step 3.1: Admin Views All Orders

```
GET {{base_url}}/api/admin/orders
Authorization: Bearer {{admin_token}}
```

**Find an order with `orderStatus: "READY"`**

#### Step 3.2: Admin Assigns Order to Delivery Partner

```
POST {{base_url}}/api/admin/orders/{{order_id}}/assign-delivery/{{delivery_partner_id}}
Authorization: Bearer {{admin_token}}
```

**Expected Response:**

```json
{
  "id": 1,
  "orderStatus": "OUT_FOR_DELIVERY", // ✅ Status changed
  "deliveryPartnerId": 1,
  "deliveryPartnerName": "Rajesh Kumar",
  "totalAmount": 345.0
}
```

**✅ Order is now assigned to delivery partner!**

---

### Phase 4: Order Delivery Management

#### Step 4.1: View All Assigned Orders

```
GET {{base_url}}/api/delivery-partners/orders
Authorization: Bearer {{delivery_token}}
```

**Expected Response:**

```json
[
  {
    "id": 1,
    "orderStatus": "OUT_FOR_DELIVERY",
    "deliveryPartnerId": 1,
    "deliveryPartnerName": "Rajesh Kumar",
    "totalAmount": 345.0,
    "deliveryAddress": {
      "street": "123 Customer St",
      "city": "Mumbai",
      "pincode": "400001"
    }
  }
]
```

#### Step 4.2: View Order Details

```
GET {{base_url}}/api/delivery-partners/orders/{{order_id}}
Authorization: Bearer {{delivery_token}}
```

#### Step 4.3: Update Status to DELIVERED

```
PUT {{base_url}}/api/delivery-partners/orders/{{order_id}}/status
Authorization: Bearer {{delivery_token}}
Content-Type: application/json

{
  "orderStatus": "DELIVERED"
}
```

**Expected Response:**

```json
{
  "id": 1,
  "orderStatus": "DELIVERED", // ✅ Status updated
  "deliveryTime": "2024-01-15T13:30:00", // ✅ Delivery time set
  "totalAmount": 345.0
}
```

**✅ Order is now delivered!**

---

## Complete Testing Flow Summary

### ✅ Registration Flow

1. ✅ Signup as delivery partner
2. ✅ Login and get token
3. ✅ Create delivery partner profile
4. ✅ Verify `isAvailable = false` by default

### ✅ Availability Management

5. ✅ Set availability to `true`
6. ✅ Get all delivery partners (admin view)
7. ✅ Get delivery partner by ID

### ✅ Order Assignment (Admin)

8. ✅ Admin views all orders
9. ✅ Admin finds order with status `READY`
10. ✅ Admin assigns order to delivery partner
11. ✅ Verify order status changed to `OUT_FOR_DELIVERY`

### ✅ Order Delivery Management

12. ✅ View all assigned orders
13. ✅ View order details
14. ✅ Update order status to `DELIVERED`
15. ✅ Verify delivery time is set

---

## Common Errors & Solutions

### Error 1: "Delivery partner is not available"

**Cause:** Trying to assign order to partner with `isAvailable = false`  
**Solution:** Update delivery partner availability to `true` first

### Error 2: "Order must be in READY status to assign delivery partner"

**Cause:** Trying to assign order that's not ready  
**Solution:** Wait for provider to mark order as `READY` first

### Error 3: "Delivery partner can only update status to OUT_FOR_DELIVERY or DELIVERED"

**Cause:** Trying to update to invalid status  
**Solution:** Only update to `DELIVERED` when order is `OUT_FOR_DELIVERY`

### Error 4: "Invalid status transition from OUT_FOR_DELIVERY to DELIVERED"

**Cause:** Order is already in wrong state  
**Solution:** Check current order status first

### Error 5: "Delivery partner profile not found for user"

**Cause:** Profile not created yet  
**Solution:** Create delivery partner profile first using `POST /api/delivery-partners`

---

## Delivery Partner Dashboard APIs Summary

For building a delivery partner dashboard in React, you'll need:

```javascript
// Profile Management
GET / api / delivery - partners / { id }; // Get my profile
PUT / api / delivery - partners / { id }; // Update profile (including availability)

// Order Management
GET / api / delivery - partners / orders; // All my assigned orders
GET / api / delivery - partners / orders / { id }; // Order details
PUT / api / delivery - partners / orders / { id } / status; // Update delivery status

// Profile Image
POST / api / delivery - partners / { id } / profile - image; // Upload profile image
```

---

## Order Status Flow (Complete)

```
PENDING
   ↓
CONFIRMED (Provider accepts)
   ↓
PREPARING (Provider starts cooking)
   ↓
READY (Provider marks ready)
   ↓
[Admin assigns delivery partner]
   ↓
OUT_FOR_DELIVERY (Delivery partner picks up)
   ↓
DELIVERED (Delivery partner completes)
```

**Delivery Partner Actions:**

- Can only see orders assigned to them
- Can only update status from `OUT_FOR_DELIVERY` to `DELIVERED`
- Cannot cancel orders
- Cannot change order details

---

## Testing Checklist

### Registration & Profile

- [ ] Signup delivery partner user
- [ ] Login delivery partner
- [ ] Create delivery partner profile
- [ ] Verify profile created with `isAvailable = false`

### Availability

- [ ] Set availability to `true`
- [ ] Get all delivery partners (admin view)
- [ ] Get delivery partner by ID

### Order Assignment (Admin)

- [ ] Admin views all orders
- [ ] Admin finds `READY` order
- [ ] Admin assigns order to delivery partner
- [ ] Verify order status changed to `OUT_FOR_DELIVERY`

### Order Delivery

- [ ] View all assigned orders
- [ ] View order details
- [ ] Update order status to `DELIVERED`
- [ ] Verify delivery time is set

---

## Vehicle Type Options

When creating delivery partner profile, use one of these vehicle types:

- `BIKE` - Motorcycle
- `SCOOTER` - Scooter
- `BICYCLE` - Bicycle
- `CAR` - Car

**Example:**

```json
{
  "vehicleType": "BIKE"
}
```

---

## Complete Example Request/Response

### Create Delivery Partner Profile

**Request:**

```json
POST /api/delivery-partners
Authorization: Bearer {token}

{
  "userId": 3,
  "fullName": "Rajesh Kumar",
  "vehicleType": "BIKE",
  "commissionRate": 10.00,
  "serviceArea": "Mumbai Central, Andheri, Bandra"
}
```

**Response:**

```json
{
  "id": 1,
  "userId": 3,
  "fullName": "Rajesh Kumar",
  "vehicleType": "BIKE",
  "commissionRate": 10.0,
  "serviceArea": "Mumbai Central, Andheri, Bandra",
  "isAvailable": false
}
```

### Update Availability

**Request:**

```json
PUT /api/delivery-partners/1
Authorization: Bearer {token}

{
  "fullName": "Rajesh Kumar",
  "vehicleType": "BIKE",
  "commissionRate": 10.00,
  "serviceArea": "Mumbai Central, Andheri, Bandra",
  "isAvailable": true
}
```

### Update Order Status

**Request:**

```json
PUT /api/delivery-partners/orders/1/status
Authorization: Bearer {token}

{
  "orderStatus": "DELIVERED"
}
```

**Response:**

```json
{
  "id": 1,
  "orderStatus": "DELIVERED",
  "deliveryTime": "2024-01-15T13:30:00",
  "deliveryPartnerId": 1,
  "deliveryPartnerName": "Rajesh Kumar"
}
```

---

This guide provides complete understanding of delivery partner flow. Test each step in Postman to understand the data flow before building your delivery partner dashboard or admin panel.
