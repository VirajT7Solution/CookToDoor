# PlateMate Provider Flow - Complete Guide & Postman Testing

## Table of Contents

1. [Provider Flow Overview](#provider-flow-overview)
2. [Provider Registration & Profile Creation](#provider-registration--profile-creation)
3. [Admin Approval Process](#admin-approval-process)
4. [Menu Item Management](#menu-item-management)
5. [Order Management](#order-management)
6. [Complete Postman Testing Guide](#complete-postman-testing-guide)

---

## Provider Flow Overview

### What is a Provider?

A **Provider** (TiffinProvider) is a food business owner who:

- Sells food items through the platform
- Manages their menu items
- Receives and processes customer orders
- Updates order status as food is prepared
- Gets paid through the platform

### Provider Lifecycle

```
1. User Registration (ROLE_PROVIDER)
   ↓
2. Create Provider Profile
   ↓
3. Admin Approval (isVerified = false → true)
   ↓
4. Create Menu Items (Only after approval)
   ↓
5. Receive Orders from Customers
   ↓
6. Update Order Status
   ↓
7. Complete Orders
```

### Key Provider States

| State        | Description                                 | Can Create Menu Items? |
| ------------ | ------------------------------------------- | ---------------------- |
| **Pending**  | Profile created, waiting for admin approval | ❌ No                  |
| **Approved** | Admin approved, `isVerified = true`         | ✅ Yes                 |
| **Rejected** | Admin rejected the provider                 | ❌ No                  |

---

## Provider Registration & Profile Creation

### Step 1: User Registration

**Endpoint:** `POST /api/auth/signup`

**Request Body:**

```json
{
  "username": "provider1",
  "email": "provider1@test.com",
  "password": "provider123",
  "role": "ROLE_PROVIDER"
}
```

**Response:**

```json
{
  "message": "User created successfully",
  "userId": 2,
  "username": "provider1"
}
```

**Important Points:**

- Role must be `ROLE_PROVIDER`
- Username and email must be unique
- Password will be encrypted automatically

### Step 2: Login as Provider

**Endpoint:** `POST /api/auth/login`

**Request Body:**

```json
{
  "username": "provider1",
  "password": "provider123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "provider1",
  "role": "ROLE_PROVIDER"
}
```

**Save the token** - You'll need it for all subsequent requests.

### Step 3: Create Provider Profile

**Endpoint:** `POST /api/tiffin-providers`

**Authorization:** `Bearer {provider_token}`

**Request Body:**

```json
{
  "user": 2,
  "zone": 1,
  "businessName": "Tasty Tiffins",
  "description": "Home made delicious food with authentic taste",
  "commissionRate": 5.0,
  "providesDelivery": false,
  "deliveryRadius": null,
  "isVerified": false
}
```

**Field Explanations:**

- `user`: User ID from registration (Step 1)
- `zone`: **Delivery zone ID** - **MUST exist first!**
  - If you get "Zone not found" error, create a zone first using `POST /api/delivery-zones`
  - Or get existing zones using `GET /api/delivery-zones` and use an existing zone ID
- `businessName`: Name of the food business
- `description`: Business description
- `commissionRate`: Platform commission percentage (e.g., 5.0 = 5%)
- `providesDelivery`: Whether provider has own delivery (usually false)
- `deliveryRadius`: If providesDelivery=true, radius in km
- `isVerified`: Always false initially, admin will approve

**Response:**

```json
{
  "id": 1,
  "user": {
    "id": 2,
    "username": "provider1",
    "email": "provider1@test.com",
    "role": "ROLE_PROVIDER"
  },
  "zone": {
    "id": 1,
    "zoneName": "Mumbai Central"
  },
  "businessName": "Tasty Tiffins",
  "description": "Home made delicious food with authentic taste",
  "commissionRate": 5.0,
  "providesDelivery": false,
  "deliveryRadius": null,
  "isVerified": false,
  "isDeleted": false,
  "createdAt": "2024-01-15T10:00:00",
  "updatedAt": "2024-01-15T10:00:00"
}
```

**Important:**

- After creating profile, provider status is **PENDING**
- `isVerified = false` means provider cannot create menu items yet
- Admin must approve before provider can proceed

---

## Admin Approval Process

### Why Approval is Needed?

- Quality control
- Verify business legitimacy
- Ensure proper documentation
- Maintain platform standards

### Admin Views Pending Providers

**Endpoint:** `GET /api/admin/providers/pending`

**Authorization:** `Bearer {admin_token}`

**Response:**

```json
[
  {
    "id": 1,
    "businessName": "Tasty Tiffins",
    "description": "Home made delicious food",
    "isVerified": false,
    "user": {
      "id": 2,
      "username": "provider1",
      "email": "provider1@test.com"
    }
  }
]
```

### Admin Approves Provider

**Endpoint:** `POST /api/admin/providers/{providerId}/approve`

**Authorization:** `Bearer {admin_token}`

**Response:**

```json
{
  "id": 1,
  "businessName": "Tasty Tiffins",
  "isVerified": true, // ✅ Changed to true
  "user": {
    "id": 2,
    "username": "provider1"
  }
}
```

**What Happens:**

- `isVerified` changes from `false` to `true`
- Provider can now create menu items
- Provider can receive orders

### Admin Rejects Provider

**Endpoint:** `POST /api/admin/providers/{providerId}/reject`

**Authorization:** `Bearer {admin_token}`

**Response:**

```json
{
  "id": 1,
  "isVerified": false,
  "isDeleted": true // Provider is soft-deleted
}
```

---

## Menu Item Management

### ⚠️ Important: Provider Must Be Approved First

Before creating menu items, ensure:

1. Provider profile exists
2. `isVerified = true` (admin approved)
3. Categories exist (created by admin)

### Step 1: Get Categories

**Endpoint:** `GET /api/categories`

**Authorization:** `Bearer {provider_token}`

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

**Note:** Save category IDs - you'll need them when creating menu items.

### Step 2: Create Menu Item

**Endpoint:** `POST /api/providers/menu-items`  

**Authorization:** `Bearer {provider_token}`

**Content-Type:** `multipart/form-data`

**Form Data:**

```
data: {
  "itemName": "Dal Makhani",
  "description": "Creamy black lentils cooked with butter and cream",
  "price": 150.00,
  "ingredients": "Black lentils, kidney beans, cream, butter, spices",
  "mealType": "LUNCH",
  "categoryId": 1,
  "isAvailable": true
}

image: [Select image file - optional]
```

**Field Explanations:**

- `itemName`: Name of the dish
- `description`: Detailed description
- `price`: Price in INR
- `ingredients`: List of ingredients
- `mealType`: `BREAKFAST`, `LUNCH`, `DINNER`, or `SNACKS`
- `categoryId`: Category ID from Step 1
- `isAvailable`: Whether item is currently available
- `image`: Optional image file (JPG, PNG)

**Response:**

```json
{
  "id": 1,
  "categoryId": 1,
  "itemName": "Dal Makhani",
  "description": "Creamy black lentils cooked with butter and cream",
  "price": 150.0,
  "ingredients": "Black lentils, kidney beans, cream, butter, spices",
  "mealType": "LUNCH",
  "isAvailable": true
}
```

### Step 3: Get All My Menu Items

**Endpoint:** `GET /api/providers/menu-items`

**Authorization:** `Bearer {provider_token}`

**Response:**

```json
[
  {
    "id": 1,
    "itemName": "Dal Makhani",
    "price": 150.0,
    "isAvailable": true,
    "mealType": "LUNCH"
  },
  {
    "id": 2,
    "itemName": "Butter Naan",
    "price": 30.0,
    "isAvailable": true,
    "mealType": "LUNCH"
  }
]
```

### Step 4: Get Menu Item by ID

**Endpoint:** `GET /api/providers/menu-items/{id}`

**Authorization:** `Bearer {provider_token}`

**Response:**

```json
{
  "id": 1,
  "categoryId": 1,
  "itemName": "Dal Makhani",
  "description": "Creamy black lentils",
  "price": 150.0,
  "ingredients": "Black lentils, cream, butter",
  "mealType": "LUNCH",
  "isAvailable": true
}
```

### Step 5: Update Menu Item

**Endpoint:** `PUT /api/providers/menu-items/{id}`

**Authorization:** `Bearer {provider_token}`

**Content-Type:** `multipart/form-data`

**Form Data:**

```
data: {
  "itemName": "Dal Makhani (Premium)",
  "description": "Updated description",
  "price": 180.00,
  "isAvailable": true
}

image: [New image file - optional]
```

**Note:** Only include fields you want to update. Omitted fields remain unchanged.

### Step 6: Toggle Availability

**Endpoint:** `PATCH /api/providers/menu-items/{id}/availability`

**Authorization:** `Bearer {provider_token}`

**Request Body:**

```json
{
  "available": false
}
```

**Response:**

```json
{
  "id": 1,
  "itemName": "Dal Makhani",
  "isAvailable": false // ✅ Changed
}
```

**Use Case:** Quickly mark item as unavailable when out of stock.

### Step 7: Delete Menu Item (Soft Delete)

**Endpoint:** `DELETE /api/providers/menu-items/{id}`

**Authorization:** `Bearer {provider_token}`

**Response:** `204 No Content`

**Note:** This is a soft delete - item is marked as deleted but not removed from database.

---

## Order Management

### Order Status Flow

```
PENDING → CONFIRMED → PREPARING → READY → OUT_FOR_DELIVERY → DELIVERED
   ↓
CANCELLED (can be cancelled at PENDING or CONFIRMED)
```

### Step 1: View All My Orders

**Endpoint:** `GET /api/providers/orders`

**Authorization:** `Bearer {provider_token}`

**Response:**

```json
[
  {
    "id": 1,
    "customerId": 3,
    "providerId": 1,
    "providerName": "Tasty Tiffins",
    "orderStatus": "PENDING",
    "subtotal": 300.0,
    "deliveryFee": 30.0,
    "platformCommission": 15.0,
    "totalAmount": 345.0,
    "cartItems": [
      {
        "cartItemId": 1,
        "itemName": "Dal Makhani",
        "quantity": 2,
        "itemPrice": 150.0,
        "itemTotal": 300.0
      }
    ],
    "orderTime": "2024-01-15T12:00:00",
    "estimatedDeliveryTime": "2024-01-15T13:00:00"
  }
]
```

### Step 2: View Order Details

**Endpoint:** `GET /api/providers/orders/{id}`

**Authorization:** `Bearer {provider_token}`

**Response:** Same as above but for single order.

### Step 3: Update Order Status

**Endpoint:** `PUT /api/providers/orders/{id}/status`

**Authorization:** `Bearer {provider_token}`

**Request Body:**

```json
{
  "orderStatus": "CONFIRMED"
}
```

**Valid Status Values:**

- `PENDING` - Order just received
- `CONFIRMED` - Provider accepted the order
- `PREPARING` - Food is being prepared
- `READY` - Food is ready for pickup/delivery
- `OUT_FOR_DELIVERY` - Assigned to delivery partner
- `DELIVERED` - Order completed
- `CANCELLED` - Order cancelled

**Response:**

```json
{
  "id": 1,
  "orderStatus": "CONFIRMED",  // ✅ Updated
  "totalAmount": 345.00,
  "cartItems": [...]
}
```

### Step 4: Cancel Order (Provider)

**Endpoint:** `POST /api/providers/orders/{id}/cancel`

**Authorization:** `Bearer {provider_token}`

**Note:** Provider can only cancel if status is `PENDING` or `CONFIRMED`.

**Response:**

```json
{
  "id": 1,
  "orderStatus": "CANCELLED"
}
```

---

## Complete Postman Testing Guide

### Prerequisites

1. **Postman Environment Setup**

   - Create environment: "PlateMate Local"
   - Variables:
     - `base_url`: `http://localhost:9090`
     - `admin_token`: (will be set after admin login)
     - `provider_token`: (will be set after provider login)
     - `provider_user_id`: (will be set after provider signup)
     - `provider_id`: (will be set after creating profile)
     - `category_id`: (will be set after creating category)
     - `menu_item_id`: (will be set after creating menu item)
     - `order_id`: (will be set after customer creates order)

2. **Admin Setup** (Do this first)
   - Admin user must exist
   - At least one delivery zone must exist
   - At least one category must exist

---

## Step-by-Step Postman Testing

### Phase 1: Setup (Admin)

#### Step 1.1: Admin Login

```
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Action:** Copy `token` → Set environment variable `admin_token`

#### Step 1.2: Create Delivery Zone (Required for Provider)

**⚠️ IMPORTANT:** You MUST create a delivery zone before creating a provider profile!

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

**Field Explanations:**

- `zoneName`: Name of the delivery zone (e.g., "Mumbai Central")
- `city`: City name (e.g., "Mumbai")
- `pincodeRanges`: Comma-separated pincodes as a string (e.g., "400001,400002,400003")

**Expected Response:**

```json
{
  "id": 1,
  "zoneName": "Mumbai Central",
  "city": "Mumbai",
  "pincodeRanges": "400001,400002,400003",
  "createdAt": "2024-01-15T10:00:00"
}
```

**Action:** Save the `id` from response → Set `zone_id` = 1 (or the actual ID you get)

**Alternative: Get All Zones to Find Existing Zone ID**

```
GET {{base_url}}/api/delivery-zones
Authorization: Bearer {{admin_token}}
```

This will return all existing zones. Use the `id` from any existing zone.

#### Step 1.3: Create Category (Required for Menu Items)

```
POST {{base_url}}/api/categories
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "categoryName": "North Indian",
  "description": "Traditional North Indian cuisine"
}
```

**Action:** Save category ID → Set `category_id` = 1 (or actual ID)

---

### Phase 2: Provider Registration

#### Step 2.1: Provider Signup

```
POST {{base_url}}/api/auth/signup
Content-Type: application/json

{
  "username": "provider1",
  "email": "provider1@test.com",
  "password": "provider123",
  "role": "ROLE_PROVIDER"
}
```

**Expected Response:**

```json
{
  "message": "User created successfully",
  "userId": 2,
  "username": "provider1"
}
```

**Action:** Save `userId` → Set `provider_user_id` = 2

#### Step 2.2: Provider Login

```
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "username": "provider1",
  "password": "provider123"
}
```

**Expected Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "...",
  "username": "provider1",
  "role": "ROLE_PROVIDER"
}
```

**Action:** Copy `token` → Set `provider_token`

#### Step 2.3: Create Provider Profile

```
POST {{base_url}}/api/tiffin-providers
Authorization: Bearer {{provider_token}}
Content-Type: application/json

{
  "user": {{provider_user_id}},
  "zone": {{zone_id}},
  "businessName": "Tasty Tiffins",
  "description": "Home made delicious food with authentic taste",
  "commissionRate": 5.0,
  "providesDelivery": false,
  "deliveryRadius": null,
  "isVerified": false
}
```

**Expected Response:**

```json
{
  "id": 1,
  "businessName": "Tasty Tiffins",
  "isVerified": false,
  "user": {
    "id": 2,
    "username": "provider1"
  }
}
```

**Action:** Save `id` → Set `provider_id` = 1

**⚠️ Important:** At this point, `isVerified = false`, so provider **cannot** create menu items yet.

---

### Phase 3: Admin Approval

#### Step 3.1: Admin Views Pending Providers

```
GET {{base_url}}/api/admin/providers/pending
Authorization: Bearer {{admin_token}}
```

**Expected Response:**

```json
[
  {
    "id": 1,
    "businessName": "Tasty Tiffins",
    "isVerified": false
  }
]
```

#### Step 3.2: Admin Approves Provider

```
POST {{base_url}}/api/admin/providers/{{provider_id}}/approve
Authorization: Bearer {{admin_token}}
```

**Expected Response:**

```json
{
  "id": 1,
  "businessName": "Tasty Tiffins",
  "isVerified": true // ✅ Now true
}
```

**✅ Provider is now approved and can create menu items!**

---

### Phase 4: Menu Item Management

#### Step 4.1: Try Creating Menu Item (Before Approval - Should Fail)

**This should fail with 403 Forbidden:**

```
POST {{base_url}}/api/providers/menu-items
Authorization: Bearer {{provider_token}}
Content-Type: multipart/form-data

Form Data:
- data: {
    "itemName": "Test Item",
    "price": 100.00,
    "categoryId": {{category_id}},
    "mealType": "LUNCH",
    "isAvailable": true
  }
```

**Expected Error:** `403 Forbidden - Provider is not approved yet`

#### Step 4.2: Create Menu Item (After Approval - Should Succeed)

**Now this should work:**

```
POST {{base_url}}/api/providers/menu-items
Authorization: Bearer {{provider_token}}
Content-Type: multipart/form-data

Form Data:
- data: {
    "itemName": "Dal Makhani",
    "description": "Creamy black lentils cooked with butter and cream",
    "price": 150.00,
    "ingredients": "Black lentils, kidney beans, cream, butter, spices",
    "mealType": "LUNCH",
    "categoryId": {{category_id}},
    "isAvailable": true
  }
- image: [Select image file - JPG/PNG]
```

**Expected Response:**

```json
{
  "id": 1,
  "itemName": "Dal Makhani",
  "price": 150.0,
  "isAvailable": true,
  "mealType": "LUNCH"
}
```

**Action:** Save `id` → Set `menu_item_id` = 1

#### Step 4.3: Get All Menu Items

```
GET {{base_url}}/api/providers/menu-items
Authorization: Bearer {{provider_token}}
```

**Expected Response:**

```json
[
  {
    "id": 1,
    "itemName": "Dal Makhani",
    "price": 150.0,
    "isAvailable": true
  }
]
```

#### Step 4.4: Get Menu Item by ID

```
GET {{base_url}}/api/providers/menu-items/{{menu_item_id}}
Authorization: Bearer {{provider_token}}
```

#### Step 4.5: Update Menu Item

```
PUT {{base_url}}/api/providers/menu-items/{{menu_item_id}}
Authorization: Bearer {{provider_token}}
Content-Type: multipart/form-data

Form Data:
- data: {
    "itemName": "Dal Makhani (Premium)",
    "price": 180.00,
    "description": "Updated description"
  }
- image: [New image - optional]
```

#### Step 4.6: Toggle Availability

```
PATCH {{base_url}}/api/providers/menu-items/{{menu_item_id}}/availability
Authorization: Bearer {{provider_token}}
Content-Type: application/json

{
  "available": false
}
```

**Expected Response:**

```json
{
  "id": 1,
  "isAvailable": false
}
```

#### Step 4.7: Delete Menu Item

```
DELETE {{base_url}}/api/providers/menu-items/{{menu_item_id}}
Authorization: Bearer {{provider_token}}
```

**Expected Response:** `204 No Content`

---

### Phase 5: Order Management

**Prerequisites:** A customer must have created an order first.

#### Step 5.1: View All Orders

```
GET {{base_url}}/api/providers/orders
Authorization: Bearer {{provider_token}}
```

**Expected Response:**

```json
[
  {
    "id": 1,
    "customerId": 3,
    "orderStatus": "PENDING",
    "totalAmount": 345.0,
    "cartItems": [
      {
        "itemName": "Dal Makhani",
        "quantity": 2,
        "itemPrice": 150.0
      }
    ],
    "orderTime": "2024-01-15T12:00:00"
  }
]
```

**Action:** Save order `id` → Set `order_id` = 1

#### Step 5.2: View Order Details

```
GET {{base_url}}/api/providers/orders/{{order_id}}
Authorization: Bearer {{provider_token}}
```

#### Step 5.3: Confirm Order

```
PUT {{base_url}}/api/providers/orders/{{order_id}}/status
Authorization: Bearer {{provider_token}}
Content-Type: application/json

{
  "orderStatus": "CONFIRMED"
}
```

**Expected Response:**

```json
{
  "id": 1,
  "orderStatus": "CONFIRMED"
}
```

#### Step 5.4: Update to Preparing

```
PUT {{base_url}}/api/providers/orders/{{order_id}}/status
Authorization: Bearer {{provider_token}}
Content-Type: application/json

{
  "orderStatus": "PREPARING"
}
```

#### Step 5.5: Update to Ready

```
PUT {{base_url}}/api/providers/orders/{{order_id}}/status
Authorization: Bearer {{provider_token}}
Content-Type: application/json

{
  "orderStatus": "READY"
}
```

#### Step 5.6: Cancel Order (If Needed)

```
POST {{base_url}}/api/providers/orders/{{order_id}}/cancel
Authorization: Bearer {{provider_token}}
```

**Note:** Can only cancel if status is `PENDING` or `CONFIRMED`.

---

## Complete Testing Flow Summary

### ✅ Provider Registration Flow

1. ✅ Signup as provider
2. ✅ Login and get token
3. ✅ Create provider profile
4. ✅ Verify `isVerified = false`

### ✅ Admin Approval Flow

5. ✅ Admin views pending providers
6. ✅ Admin approves provider
7. ✅ Verify `isVerified = true`

### ✅ Menu Item Management Flow

8. ✅ Get categories
9. ✅ Create menu item (should work after approval)
10. ✅ Get all menu items
11. ✅ Get menu item by ID
12. ✅ Update menu item
13. ✅ Toggle availability
14. ✅ Delete menu item

### ✅ Order Management Flow

15. ✅ View all orders
16. ✅ View order details
17. ✅ Update order status (CONFIRMED → PREPARING → READY)
18. ✅ Cancel order (if needed)

---

## Common Errors & Solutions

### Error 1: "Provider is not approved yet"

**Cause:** Trying to create menu items before admin approval  
**Solution:** Wait for admin to approve provider (`isVerified = true`)

### Error 2: "Provider profile not found for user"

**Cause:** Provider profile not created yet  
**Solution:** Create provider profile first using `POST /api/tiffin-providers`

### Error 3: "Category not found"

**Cause:** Category ID doesn't exist  
**Solution:** Check category exists using `GET /api/categories`

### Error 4: "Cannot access another provider's item"

**Cause:** Trying to access menu item from different provider  
**Solution:** Use your own provider token

### Error 5: "Order can only be cancelled if it is PENDING or CONFIRMED"

**Cause:** Trying to cancel order in wrong status  
**Solution:** Check order status first, only cancel if PENDING or CONFIRMED

---

## Provider Dashboard APIs Summary

For building a provider dashboard in React, you'll need:

```javascript
// Profile
GET / api / tiffin - providers / { id }; // Get my profile
PUT / api / tiffin - providers / { id }; // Update profile

// Menu Items
GET / api / providers / menu - items; // All my items
POST / api / providers / menu - items; // Create item
PUT / api / providers / menu - items / { id }; // Update item
DELETE / api / providers / menu - items / { id }; // Delete item
PATCH / api / providers / menu - items / { id } / availability; // Toggle availability

// Orders
GET / api / providers / orders; // All my orders
GET / api / providers / orders / { id }; // Order details
PUT / api / providers / orders / { id } / status; // Update status
POST / api / providers / orders / { id } / cancel; // Cancel order

// Categories (for dropdown)
GET / api / categories; // All categories
```

---

## Testing Checklist

### Registration & Profile

- [ ] Signup provider user
- [ ] Login provider
- [ ] Create provider profile
- [ ] Verify profile created with `isVerified = false`

### Approval

- [ ] Admin views pending providers
- [ ] Admin approves provider
- [ ] Verify `isVerified = true`

### Menu Items

- [ ] Try creating menu item before approval (should fail)
- [ ] Create menu item after approval (should succeed)
- [ ] Get all menu items
- [ ] Get menu item by ID
- [ ] Update menu item
- [ ] Toggle availability
- [ ] Delete menu item

### Orders

- [ ] View all orders
- [ ] View order details
- [ ] Update order status to CONFIRMED
- [ ] Update order status to PREPARING
- [ ] Update order status to READY
- [ ] Cancel order (if applicable)

---

This guide provides complete understanding of provider flow. Test each step in Postman to understand the data flow before building your provider dashboard or admin panel.
