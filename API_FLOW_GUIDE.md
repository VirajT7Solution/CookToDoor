# PlateMate Backend - Complete API Flow & Testing Guide

## Table of Contents

1. [Project Architecture](#project-architecture)
2. [User Roles & Permissions](#user-roles--permissions)
3. [Authentication Flow](#authentication-flow)
4. [Complete API Endpoints](#complete-api-endpoints)
5. [Postman Testing Guide](#postman-testing-guide)
6. [Admin Panel API Mapping](#admin-panel-api-mapping)

---

## Project Architecture

### Overview

PlateMate is a **food delivery platform** (like Swiggy/Zomato) with the following entities:

```
┌─────────────┐
│    User     │ (Base entity - authentication)
└──────┬──────┘
       │
       ├─── Customer (End users who order food)
       ├─── TiffinProvider (Restaurants/Food providers)
       ├─── DeliveryPartner (Delivery personnel)
       └─── Admin (Platform administrators)
```

### Core Flow

```
1. User Registration/Login
   ↓
2. Role-based Profile Creation
   - Customer → Customer profile
   - Provider → TiffinProvider profile (needs admin approval)
   - Delivery Partner → DeliveryPartner profile
   ↓
3. Provider Operations
   - Create/Manage Menu Items
   - View Orders
   - Update Order Status
   ↓
4. Customer Operations
   - Browse Menu Items
   - Add to Cart
   - Place Orders
   - Make Payments
   ↓
5. Order Management
   - Provider: Accept/Reject/Update Status
   - Admin: Assign Delivery Partners
   - Delivery Partner: Update Delivery Status
   ↓
6. Admin Operations
   - Approve/Reject Providers
   - Manage Categories
   - View All Orders
   - Manage Users
```

### Technology Stack

- **Framework**: Spring Boot 3.5.6
- **Security**: Spring Security + JWT
- **Database**: PostgreSQL
- **ORM**: JPA/Hibernate
- **Payment**: Razorpay Integration

---

## User Roles & Permissions

### Role Enum

```java
ROLE_CUSTOMER        // End users
ROLE_PROVIDER        // Food providers/restaurants
DELIVERY_PARTNER     // Delivery personnel
ROLE_ADMIN           // Platform administrators
```

### Permission Matrix

| Endpoint Category   | Customer | Provider | Delivery Partner | Admin    |
| ------------------- | -------- | -------- | ---------------- | -------- |
| Authentication      | ✅       | ✅       | ✅               | ✅       |
| Browse Menu Items   | ✅       | ❌       | ❌               | ✅       |
| Manage Menu Items   | ❌       | ✅       | ❌               | ✅       |
| Cart Operations     | ✅       | ❌       | ❌               | ❌       |
| Order Management    | ✅ (own) | ✅ (own) | ✅ (assigned)    | ✅ (all) |
| Provider Approval   | ❌       | ❌       | ❌               | ✅       |
| User Management     | ❌       | ❌       | ❌               | ✅       |
| Category Management | ❌       | ❌       | ❌               | ✅       |

---

## Authentication Flow

### 1. User Registration

```
POST /api/auth/signup
Body: {
  "username": "admin",
  "email": "admin@platemate.com",
  "password": "password123",
  "role": "ROLE_ADMIN"  // or ROLE_CUSTOMER, ROLE_PROVIDER, DELIVERY_PARTNER
}
```

### 2. User Login

```
POST /api/auth/login
Body: {
  "username": "admin",
  "password": "password123"
}

Response: {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin",
  "role": "ROLE_ADMIN"
}
```

### 3. Using JWT Token

All protected endpoints require the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Complete API Endpoints

### Base URL

```
http://localhost:9090
```

### 1. Authentication (`/api/auth`)

| Method | Endpoint           | Auth Required | Role | Description       |
| ------ | ------------------ | ------------- | ---- | ----------------- |
| POST   | `/api/auth/login`  | ❌            | Any  | User login        |
| POST   | `/api/auth/signup` | ❌            | Any  | User registration |

### 2. Users (`/api/users`)

| Method | Endpoint                        | Auth Required | Role                   | Description          |
| ------ | ------------------------------- | ------------- | ---------------------- | -------------------- |
| GET    | `/api/users`                    | ✅            | ADMIN, PROVIDER        | Get all users        |
| GET    | `/api/users/{id}`               | ✅            | ADMIN, Owner           | Get user by ID       |
| POST   | `/api/users`                    | ✅            | ADMIN                  | Create user          |
| PUT    | `/api/users/{id}`               | ✅            | ADMIN, Owner           | Update user          |
| DELETE | `/api/users/{id}`               | ✅            | ADMIN                  | Delete user          |
| POST   | `/api/users/{id}/profile-image` | ✅            | ADMIN, CUSTOMER, Owner | Upload profile image |

### 3. Categories (`/api/categories`)

| Method | Endpoint               | Auth Required | Role                      | Description         |
| ------ | ---------------------- | ------------- | ------------------------- | ------------------- |
| GET    | `/api/categories`      | ✅            | ADMIN, PROVIDER, CUSTOMER | List all categories |
| GET    | `/api/categories/{id}` | ✅            | ADMIN, PROVIDER, CUSTOMER | Get category by ID  |
| POST   | `/api/categories`      | ✅            | ADMIN                     | Create category     |
| PUT    | `/api/categories/{id}` | ✅            | ADMIN                     | Update category     |
| DELETE | `/api/categories/{id}` | ✅            | ADMIN                     | Delete category     |

### 4. Tiffin Providers (`/api/tiffin-providers`)

| Method | Endpoint                                      | Auth Required | Role            | Description                |
| ------ | --------------------------------------------- | ------------- | --------------- | -------------------------- |
| GET    | `/api/tiffin-providers`                       | ✅            | ADMIN, PROVIDER | Get all providers          |
| GET    | `/api/tiffin-providers/{id}`                  | ✅            | ADMIN, PROVIDER | Get provider by ID         |
| GET    | `/api/tiffin-providers/{id}/PROVIDER_PROFILE` | ❌            | Public          | Get provider profile image |
| POST   | `/api/tiffin-providers`                       | ✅            | ADMIN, PROVIDER | Create provider            |
| PUT    | `/api/tiffin-providers/{id}`                  | ✅            | ADMIN, PROVIDER | Update provider            |
| DELETE | `/api/tiffin-providers/{id}`                  | ✅            | ADMIN, PROVIDER | Delete provider            |
| POST   | `/api/tiffin-providers/{id}/profile-image`    | ✅            | ADMIN, PROVIDER | Upload provider image      |

### 5. Admin Provider Management (`/api/admin/providers`)

| Method | Endpoint                                    | Auth Required | Role  | Description           |
| ------ | ------------------------------------------- | ------------- | ----- | --------------------- |
| GET    | `/api/admin/providers/pending`              | ✅            | ADMIN | Get pending providers |
| POST   | `/api/admin/providers/{providerId}/approve` | ✅            | ADMIN | Approve provider      |
| POST   | `/api/admin/providers/{providerId}/reject`  | ✅            | ADMIN | Reject provider       |

### 6. Menu Items - Provider (`/api/providers/menu-items`)

| Method | Endpoint                                      | Auth Required | Role     | Description                  |
| ------ | --------------------------------------------- | ------------- | -------- | ---------------------------- |
| GET    | `/api/providers/menu-items`                   | ✅            | PROVIDER | Get my menu items            |
| GET    | `/api/providers/menu-items/{id}`              | ✅            | PROVIDER | Get menu item by ID          |
| POST   | `/api/providers/menu-items`                   | ✅            | PROVIDER | Create menu item (multipart) |
| PUT    | `/api/providers/menu-items/{id}`              | ✅            | PROVIDER | Update menu item (multipart) |
| PATCH  | `/api/providers/menu-items/{id}/availability` | ✅            | PROVIDER | Toggle availability          |
| DELETE | `/api/providers/menu-items/{id}`              | ✅            | PROVIDER | Delete menu item             |

### 7. Menu Items - Customer (`/api/customers/menu-items`)

| Method | Endpoint                                                                | Auth Required | Role   | Description                      |
| ------ | ----------------------------------------------------------------------- | ------------- | ------ | -------------------------------- |
| GET    | `/api/customers/menu-items`                                             | ❌            | Public | Get all menu items (paginated)   |
| GET    | `/api/customers/menu-items/{id}`                                        | ❌            | Public | Get menu item by ID              |
| GET    | `/api/customers/menu-items/provider/{providerId}`                       | ❌            | Public | Get items by provider            |
| GET    | `/api/customers/menu-items/category/{categoryId}`                       | ❌            | Public | Get items by category            |
| GET    | `/api/customers/menu-items/meal-type/{mealType}`                        | ❌            | Public | Get items by meal type           |
| GET    | `/api/customers/menu-items/search?q={query}`                            | ❌            | Public | Search menu items                |
| GET    | `/api/customers/menu-items/provider/{providerId}/category/{categoryId}` | ❌            | Public | Get items by provider & category |

### 8. Cart (`/api/customers/cart`)

| Method | Endpoint                           | Auth Required | Role     | Description      |
| ------ | ---------------------------------- | ------------- | -------- | ---------------- |
| GET    | `/api/customers/cart`              | ✅            | CUSTOMER | Get cart items   |
| POST   | `/api/customers/cart`              | ✅            | CUSTOMER | Add item to cart |
| PUT    | `/api/customers/cart/{cartItemId}` | ✅            | CUSTOMER | Update cart item |
| DELETE | `/api/customers/cart/{cartItemId}` | ✅            | CUSTOMER | Remove cart item |
| DELETE | `/api/customers/cart`              | ✅            | CUSTOMER | Clear cart       |

### 9. Orders (`/api`)

| Method               | Endpoint                                                          | Auth Required | Role             | Description             |
| -------------------- | ----------------------------------------------------------------- | ------------- | ---------------- | ----------------------- |
| **Customer**         |                                                                   |               |                  |                         |
| POST                 | `/api/customers/orders`                                           | ✅            | CUSTOMER         | Create order            |
| GET                  | `/api/customers/orders`                                           | ✅            | CUSTOMER         | Get my orders           |
| GET                  | `/api/customers/orders/{id}`                                      | ✅            | CUSTOMER         | Get order by ID         |
| POST                 | `/api/customers/orders/{id}/cancel`                               | ✅            | CUSTOMER         | Cancel order            |
| **Provider**         |                                                                   |               |                  |                         |
| GET                  | `/api/providers/orders`                                           | ✅            | PROVIDER         | Get my orders           |
| GET                  | `/api/providers/orders/{id}`                                      | ✅            | PROVIDER         | Get order by ID         |
| PUT                  | `/api/providers/orders/{id}/status`                               | ✅            | PROVIDER         | Update order status     |
| POST                 | `/api/providers/orders/{id}/cancel`                               | ✅            | PROVIDER         | Cancel order            |
| **Delivery Partner** |                                                                   |               |                  |                         |
| GET                  | `/api/delivery-partners/orders`                                   | ✅            | DELIVERY_PARTNER | Get assigned orders     |
| GET                  | `/api/delivery-partners/orders/{id}`                              | ✅            | DELIVERY_PARTNER | Get order by ID         |
| PUT                  | `/api/delivery-partners/orders/{id}/status`                       | ✅            | DELIVERY_PARTNER | Update delivery status  |
| **Admin**            |                                                                   |               |                  |                         |
| GET                  | `/api/admin/orders`                                               | ✅            | ADMIN            | Get all orders          |
| POST                 | `/api/admin/orders/{orderId}/assign-delivery/{deliveryPartnerId}` | ✅            | ADMIN            | Assign delivery partner |

### 10. Payments (`/api`)

| Method | Endpoint                                   | Auth Required | Role     | Description          |
| ------ | ------------------------------------------ | ------------- | -------- | -------------------- |
| POST   | `/api/customers/payments/orders/{orderId}` | ✅            | CUSTOMER | Create payment order |
| GET    | `/api/customers/payments/orders/{orderId}` | ✅            | CUSTOMER | Get payment order    |

### 11. Customers (`/api/customers`)

| Method | Endpoint              | Auth Required | Role         | Description             |
| ------ | --------------------- | ------------- | ------------ | ----------------------- |
| GET    | `/api/customers`      | ✅            | ADMIN        | Get all customers       |
| GET    | `/api/customers/{id}` | ✅            | ADMIN, Owner | Get customer by ID      |
| POST   | `/api/customers`      | ✅            | CUSTOMER     | Create customer profile |
| PUT    | `/api/customers/{id}` | ✅            | ADMIN, Owner | Update customer         |
| DELETE | `/api/customers/{id}` | ✅            | ADMIN        | Delete customer         |

### 12. Delivery Partners (`/api/delivery-partners`)

| Method | Endpoint                                    | Auth Required | Role                    | Description          |
| ------ | ------------------------------------------- | ------------- | ----------------------- | -------------------- |
| POST   | `/api/delivery-partners/{id}/profile-image` | ✅            | ADMIN, DELIVERY_PARTNER | Upload profile image |

### 13. Delivery Partner CRUD (`/api/admin/delivery-partners`)

| Method | Endpoint                            | Auth Required | Role  | Description                |
| ------ | ----------------------------------- | ------------- | ----- | -------------------------- |
| GET    | `/api/admin/delivery-partners`      | ✅            | ADMIN | Get all delivery partners  |
| GET    | `/api/admin/delivery-partners/{id}` | ✅            | ADMIN | Get delivery partner by ID |
| POST   | `/api/admin/delivery-partners`      | ✅            | ADMIN | Create delivery partner    |
| PUT    | `/api/admin/delivery-partners/{id}` | ✅            | ADMIN | Update delivery partner    |
| DELETE | `/api/admin/delivery-partners/{id}` | ✅            | ADMIN | Delete delivery partner    |

### 14. Delivery Zones (`/api/delivery-zones`)

| Method | Endpoint                                           | Auth Required | Role  | Description             |
| ------ | -------------------------------------------------- | ------------- | ----- | ----------------------- |
| GET    | `/api/delivery-zones`                              | ✅            | ADMIN | Get all zones           |
| GET    | `/api/delivery-zones/{id}`                         | ✅            | ADMIN | Get zone by ID          |
| POST   | `/api/delivery-zones`                              | ✅            | ADMIN | Create zone             |
| PUT    | `/api/delivery-zones/{id}`                         | ✅            | ADMIN | Update zone             |
| DELETE | `/api/delivery-zones/{id}`                         | ✅            | ADMIN | Delete zone             |
| POST   | `/api/delivery-zones/{zoneId}/assign/{providerId}` | ✅            | ADMIN | Assign zone to provider |

### 15. Ratings & Reviews (`/api`)

| Method | Endpoint                          | Auth Required | Role     | Description        |
| ------ | --------------------------------- | ------------- | -------- | ------------------ |
| POST   | `/api/customers/ratings/provider` | ✅            | CUSTOMER | Rate provider      |
| GET    | `/api/ratings/summary`            | ❌            | Public   | Get rating summary |

### 16. Payouts (`/api`)

| Method | Endpoint                              | Auth Required | Role     | Description             |
| ------ | ------------------------------------- | ------------- | -------- | ----------------------- |
| GET    | `/api/providers/payouts/statements`   | ✅            | PROVIDER | Get payout statements   |
| POST   | `/api/admin/payouts/run/{providerId}` | ✅            | ADMIN    | Run payout for provider |

### 17. Images (`/api/images`)

| Method | Endpoint                                   | Auth Required | Role    | Description  |
| ------ | ------------------------------------------ | ------------- | ------- | ------------ |
| POST   | `/api/images/upload/{imageType}/{ownerId}` | ✅            | Various | Upload image |
| GET    | `/api/images/view/{id}`                    | ❌            | Public  | View image   |

### 18. Webhooks (`/api/webhooks`)

| Method | Endpoint                  | Auth Required | Role   | Description       |
| ------ | ------------------------- | ------------- | ------ | ----------------- |
| POST   | `/api/webhooks/razorpay`  | ❌            | Public | Razorpay webhook  |
| POST   | `/api/webhooks/razorpayx` | ❌            | Public | RazorpayX webhook |

### 19. Addresses (`/api/addresses`)

| Method | Endpoint                          | Auth Required | Role         | Description    |
| ------ | --------------------------------- | ------------- | ------------ | -------------- |
| POST   | `/api/addresses/{userId}/address` | ✅            | ADMIN, Owner | Create address |

---

## Postman Testing Guide

### Step 1: Setup Postman Environment

1. **Create Environment**

   - Click "Environments" → "Create Environment"
   - Name: "PlateMate Local"
   - Add variables:
     - `base_url`: `http://localhost:9090`
     - `token`: (leave empty, will be set after login)
     - `admin_token`: (for admin operations)
     - `customer_token`: (for customer operations)
     - `provider_token`: (for provider operations)

2. **Set Base URL**
   - In requests, use: `{{base_url}}/api/...`

### Step 2: Create Admin User (First Time Setup)

**Request 1: Signup Admin**

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

### Step 3: Login as Admin

**Request 2: Admin Login**

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
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin",
  "role": "ROLE_ADMIN"
}
```

**Action:** Copy the `token` value and set it in your Postman environment variable `admin_token`

### Step 4: Setup Authorization Header

**For all subsequent requests:**

1. Go to "Authorization" tab
2. Type: "Bearer Token"
3. Token: `{{admin_token}}`

OR manually add header:

```
Authorization: Bearer {{admin_token}}
```

### Step 5: Test Admin Endpoints

#### 5.1 Create Category

```
POST {{base_url}}/api/categories
Authorization: Bearer {{admin_token}}
Content-Type: application/json

{
  "categoryName": "North Indian",
  "description": "Traditional North Indian cuisine"
}
```

#### 5.2 Get All Categories

```
GET {{base_url}}/api/categories
Authorization: Bearer {{admin_token}}
```

#### 5.3 Get All Users

```
GET {{base_url}}/api/users
Authorization: Bearer {{admin_token}}
```

#### 5.4 Get All Orders (Admin View)

```
GET {{base_url}}/api/admin/orders
Authorization: Bearer {{admin_token}}
```

### Step 6: Create Test Users

#### 6.1 Create Customer User

```
POST {{base_url}}/api/auth/signup
Content-Type: application/json

{
  "username": "customer1",
  "email": "customer1@test.com",
  "password": "customer123",
  "role": "ROLE_CUSTOMER"
}
```

#### 6.2 Create Provider User

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

### Step 7: Login as Customer

```
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "username": "customer1",
  "password": "customer123"
}
```

Save the token as `customer_token`

### Step 8: Test Customer Endpoints

#### 8.1 Browse Menu Items

```
GET {{base_url}}/api/customers/menu-items?page=0&size=10
```

#### 8.2 Get Categories

```
GET {{base_url}}/api/categories
Authorization: Bearer {{customer_token}}
```

#### 8.3 Create Customer Profile

```
POST {{base_url}}/api/customers
Authorization: Bearer {{customer_token}}
Content-Type: application/json

{
  "user": {
    "id": <user_id_from_login>
  },
  "fullName": "John Doe",
  "phoneNumber": "1234567890"
}
```

### Step 9: Login as Provider

```
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "username": "provider1",
  "password": "provider123"
}
```

Save the token as `provider_token`

### Step 10: Test Provider Endpoints

#### 10.1 Create Provider Profile

```
POST {{base_url}}/api/tiffin-providers
Authorization: Bearer {{provider_token}}
Content-Type: application/json

{
  "userId": <provider_user_id>,
  "businessName": "Tasty Tiffins",
  "description": "Home made delicious food",
  "phoneNumber": "9876543210",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  }
}
```

#### 10.2 Admin Approves Provider

```
POST {{base_url}}/api/admin/providers/{providerId}/approve
Authorization: Bearer {{admin_token}}
```

#### 10.3 Create Menu Item

```
POST {{base_url}}/api/providers/menu-items
Authorization: Bearer {{provider_token}}
Content-Type: multipart/form-data

Form Data:
- data: {
    "itemName": "Dal Makhani",
    "description": "Creamy black lentils",
    "price": 150.00,
    "ingredients": "Black lentils, cream, butter",
    "mealType": "LUNCH",
    "categoryId": 1,
    "isAvailable": true
  }
- image: [Select file]
```

### Step 11: Complete Order Flow

#### 11.1 Customer: Add to Cart

```
POST {{base_url}}/api/customers/cart
Authorization: Bearer {{customer_token}}
Content-Type: application/json

{
  "menuItemId": 1,
  "quantity": 2
}
```

#### 11.2 Customer: Get Cart

```
GET {{base_url}}/api/customers/cart
Authorization: Bearer {{customer_token}}
```

#### 11.3 Customer: Create Order

```
POST {{base_url}}/api/customers/orders
Authorization: Bearer {{customer_token}}
Content-Type: application/json

{
  "deliveryAddress": {
    "street": "456 Customer St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400002"
  }
}
```

#### 11.4 Provider: View Orders

```
GET {{base_url}}/api/providers/orders
Authorization: Bearer {{provider_token}}
```

#### 11.5 Provider: Update Order Status

```
PUT {{base_url}}/api/providers/orders/{orderId}/status
Authorization: Bearer {{provider_token}}
Content-Type: application/json

{
  "orderStatus": "CONFIRMED"
}
```

#### 11.6 Admin: View All Orders

```
GET {{base_url}}/api/admin/orders
Authorization: Bearer {{admin_token}}
```

---

## Admin Panel API Mapping

### Dashboard APIs

```javascript
// Get Dashboard Stats
GET / api / admin / orders; // All orders
GET / api / users; // All users
GET / api / tiffin - providers; // All providers
GET / api / admin / providers / pending; // Pending approvals
```

### User Management

```javascript
GET / api / users; // List all users
GET / api / users / { id }; // Get user details
POST / api / users; // Create user
PUT / api / users / { id }; // Update user
DELETE / api / users / { id }; // Delete user
```

### Provider Management

```javascript
GET / api / tiffin - providers; // List all providers
GET / api / admin / providers / pending; // Pending providers
POST / api / admin / providers / { id } / approve; // Approve provider
POST / api / admin / providers / { id } / reject; // Reject provider
PUT / api / tiffin - providers / { id }; // Update provider
DELETE / api / tiffin - providers / { id }; // Delete provider
```

### Category Management

```javascript
GET / api / categories; // List categories
POST / api / categories; // Create category
PUT / api / categories / { id }; // Update category
DELETE / api / categories / { id }; // Delete category
```

### Order Management

```javascript
GET / api / admin / orders; // All orders
GET / api / admin / orders / { orderId }; // Order details
POST / api / admin / orders / { orderId } / assign -
  delivery / { deliveryPartnerId }; // Assign delivery
```

### Menu Item Management (Admin View)

```javascript
// Note: Admin can view all menu items through provider endpoints
GET / api / tiffin - providers / { providerId }; // Get provider details (includes menu items)
```

### Delivery Partner Management

```javascript
GET / api / admin / delivery - partners; // List all
GET / api / admin / delivery - partners / { id }; // Get details
POST / api / admin / delivery - partners; // Create
PUT / api / admin / delivery - partners / { id }; // Update
DELETE / api / admin / delivery - partners / { id }; // Delete
```

### Delivery Zone Management

```javascript
GET / api / delivery - zones; // List all
POST / api / delivery - zones; // Create
PUT / api / delivery - zones / { id }; // Update
DELETE / api / delivery - zones / { id }; // Delete
POST / api / delivery - zones / { zoneId } / assign / { providerId }; // Assign zone
```

---

## Testing Checklist

### ✅ Authentication

- [ ] Signup admin user
- [ ] Login admin
- [ ] Signup customer
- [ ] Login customer
- [ ] Signup provider
- [ ] Login provider

### ✅ Admin Operations

- [ ] Create category
- [ ] List categories
- [ ] Update category
- [ ] Get all users
- [ ] Get all orders
- [ ] View pending providers
- [ ] Approve provider
- [ ] Reject provider

### ✅ Provider Operations

- [ ] Create provider profile
- [ ] Create menu item
- [ ] List menu items
- [ ] Update menu item
- [ ] View orders
- [ ] Update order status

### ✅ Customer Operations

- [ ] Browse menu items
- [ ] Search menu items
- [ ] Add to cart
- [ ] View cart
- [ ] Create order
- [ ] View orders
- [ ] Cancel order

### ✅ Order Flow

- [ ] Customer creates order
- [ ] Provider views order
- [ ] Provider updates status
- [ ] Admin views all orders
- [ ] Admin assigns delivery partner

---

## Common Request/Response Examples

### Login Request

```json
{
  "username": "admin",
  "password": "admin123"
}
```

### Login Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin",
  "role": "ROLE_ADMIN"
}
```

### Create Category Request

```json
{
  "categoryName": "South Indian",
  "description": "Traditional South Indian dishes"
}
```

### Create Menu Item Request (Multipart)

```
Form Data:
- data: {
    "itemName": "Idli Sambar",
    "description": "Soft idlis with sambar",
    "price": 80.00,
    "ingredients": "Rice, urad dal, sambar",
    "mealType": "BREAKFAST",
    "categoryId": 1,
    "isAvailable": true
  }
- image: [file]
```

### Order Response

```json
{
  "id": 1,
  "customerId": 2,
  "providerId": 3,
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
  "orderTime": "2024-01-15T10:30:00",
  "estimatedDeliveryTime": "2024-01-15T11:30:00"
}
```

---

## Error Responses

### 401 Unauthorized

```json
{
  "error": "Unauthorized",
  "message": "Full authentication is required to access this resource"
}
```

### 403 Forbidden

```json
{
  "error": "Forbidden",
  "message": "Access Denied"
}
```

### 404 Not Found

```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 400 Bad Request

```json
{
  "error": "Bad Request",
  "message": "Invalid request data"
}
```

---

## Next Steps for React Admin Panel

1. **Setup React Project**

   - Create React app with TypeScript
   - Install Axios/Fetch for API calls
   - Setup routing (React Router)

2. **Authentication**

   - Login page
   - Store JWT token (localStorage/sessionStorage)
   - Add token to all API requests
   - Handle token expiration

3. **Dashboard**

   - Display stats (orders, users, providers)
   - Recent orders widget
   - Pending approvals widget

4. **Pages to Create**

   - Users Management
   - Providers Management (with approval)
   - Categories Management
   - Orders Management
   - Delivery Partners Management
   - Delivery Zones Management

5. **Components**
   - Data tables with pagination
   - Forms for create/update
   - Modals for confirmations
   - Toast notifications

---

## Tips for Testing

1. **Use Postman Collections**: Create a collection for each role (Admin, Provider, Customer)
2. **Environment Variables**: Use variables for tokens and IDs
3. **Pre-request Scripts**: Auto-set authorization headers
4. **Tests**: Add assertions to verify responses
5. **Documentation**: Add descriptions to each request

---

This guide provides a complete understanding of the API flow. Test each endpoint step by step to understand the data structure and responses before building your React admin panel.
