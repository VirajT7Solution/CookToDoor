# PlateMate Customer Flow - Complete Guide & Postman Testing

## Table of Contents

1. [Customer Flow Overview](#customer-flow-overview)
2. [Customer Registration & Profile Creation](#customer-registration--profile-creation)
3. [Browsing Menu Items](#browsing-menu-items)
4. [Cart Management](#cart-management)
5. [Order Creation & Payment](#order-creation--payment)
6. [Order Tracking](#order-tracking)
7. [Complete Postman Testing Guide](#complete-postman-testing-guide)

---

## Customer Flow Overview

### What is a Customer?

A **Customer** is an end user who:

- Browses food items from different providers
- Adds items to cart
- Places orders
- Makes payments
- Tracks order status
- Receives food delivery

### Customer Lifecycle

```
1. User Registration (ROLE_CUSTOMER)
   ↓
2. Create Customer Profile
   ↓
3. Browse Menu Items
   ↓
4. Add Items to Cart
   ↓
5. Create Order
   ↓
6. Make Payment
   ↓
7. Track Order Status
   ↓
8. Receive Delivery
```

### Complete Order Flow (Customer Perspective)

```
Browse Menu → Add to Cart → View Cart → Create Order → Make Payment →
Track Order → Receive Delivery
```

---

## Customer Registration & Profile Creation

### Step 1: User Registration

**Endpoint:** `POST /api/auth/signup`

**Request Body:**

```json
{
  "username": "customer1",
  "email": "customer1@test.com",
  "password": "customer123",
  "role": "ROLE_CUSTOMER"
}
```

**Response:**

```json
{
  "message": "User created successfully",
  "userId": 2,
  "username": "customer1"
}
```

**Important Points:**

- Role must be `ROLE_CUSTOMER`
- Username and email must be unique
- Password will be encrypted automatically

### Step 2: Login as Customer

**Endpoint:** `POST /api/auth/login`

**Request Body:**

```json
{
  "username": "customer1",
  "password": "customer123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "customer1",
  "role": "ROLE_CUSTOMER"
}
```

**Save the token** - You'll need it for all subsequent requests.

### Step 3: Create Customer Profile

**Endpoint:** `POST /api/customers`

**Authorization:** `Bearer {customer_token}`

**Request Body:**

```json
{
  "userId": 2,
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-15"
}
```

**Field Explanations:**

- `userId`: User ID from registration (Step 1)
- `fullName`: Full name of the customer
- `dateOfBirth`: Date of birth (optional, format: YYYY-MM-DD)

**Response:**

```json
{
  "id": 1,
  "userId": 2,
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-15"
}
```

**Important:**

- Customer profile must be created before adding items to cart
- Profile is required for order creation

### Step 4: Add Address (Optional but Recommended)

**Endpoint:** `POST /api/users/{userId}/address`

**Authorization:** `Bearer {customer_token}`

**Request Body:**

```json
{
  "street1": "123 Main Street",
  "street2": "Apartment 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "address_type": "HOME"
}
```

**Response:**

```json
{
  "id": 1,
  "street1": "123 Main Street",
  "street2": "Apartment 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "addressType": "HOME"
}
```

---

## Browsing Menu Items

### Get All Menu Items (Paginated)

**Endpoint:** `GET /api/customers/menu-items`

**No Authorization Required** (Public endpoint)

**Query Parameters:**

- `page`: Page number (default: 0)
- `size`: Items per page (default: 20)
- `sort`: Sort field and direction (default: "id,asc")

**Example:**

```
GET /api/customers/menu-items?page=0&size=10&sort=price,asc
```

**Response:**

```json
{
  "content": [
    {
      "id": 1,
      "itemName": "Dal Makhani",
      "description": "Creamy black lentils",
      "price": 150.0,
      "ingredients": "Black lentils, cream, butter",
      "mealType": "LUNCH",
      "categoryId": 1,
      "categoryName": "North Indian",
      "providerId": 1,
      "providerName": "provider1",
      "providerBusinessName": "Tasty Tiffins"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 50,
  "totalPages": 5,
  "hasNext": true,
  "hasPrevious": false
}
```

### Get Menu Items by Provider

**Endpoint:** `GET /api/customers/menu-items/provider/{providerId}`

**Query Parameters:** Same as above (page, size, sort)

**Example:**

```
GET /api/customers/menu-items/provider/1?page=0&size=20
```

### Get Menu Items by Category

**Endpoint:** `GET /api/customers/menu-items/category/{categoryId}`

**Example:**

```
GET /api/customers/menu-items/category/1?page=0&size=20
```

### Get Menu Items by Meal Type

**Endpoint:** `GET /api/customers/menu-items/meal-type/{mealType}`

**Meal Types:** `BREAKFAST`, `LUNCH`, `DINNER`, `SNACKS`

**Example:**

```
GET /api/customers/menu-items/meal-type/LUNCH?page=0&size=20
```

### Search Menu Items

**Endpoint:** `GET /api/customers/menu-items/search?q={query}`

**Example:**

```
GET /api/customers/menu-items/search?q=dal&page=0&size=20
```

**Searches in:** Item name and description

### Get Menu Item by ID

**Endpoint:** `GET /api/customers/menu-items/{id}`

**Response:**

```json
{
  "id": 1,
  "itemName": "Dal Makhani",
  "description": "Creamy black lentils",
  "price": 150.0,
  "ingredients": "Black lentils, cream, butter",
  "mealType": "LUNCH",
  "categoryId": 1,
  "categoryName": "North Indian",
  "providerId": 1,
  "providerBusinessName": "Tasty Tiffins"
}
```

### Get Categories

**Endpoint:** `GET /api/categories`

**Authorization:** `Bearer {customer_token}` (or any authenticated user)

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

---

## Cart Management

### Add Item to Cart

**Endpoint:** `POST /api/customers/cart`

**Authorization:** `Bearer {customer_token}`

**Request Body:**

```json
{
  "menuItemId": 1,
  "quantity": 2,
  "specialInstructions": "Less spicy please"
}
```

**Field Explanations:**

- `menuItemId`: ID of the menu item to add
- `quantity`: Number of items (must be > 0)
- `specialInstructions`: Optional special instructions for the item

**Response:**

```json
{
  "id": 1,
  "menuItemId": 1,
  "itemName": "Dal Makhani",
  "quantity": 2,
  "itemPrice": 150.0,
  "itemTotal": 300.0,
  "specialInstructions": "Less spicy please",
  "providerId": 1,
  "providerName": "Tasty Tiffins"
}
```

**Important:**

- Customer profile must exist before adding to cart
- Cart items are grouped by provider
- Each item calculates: `itemTotal = itemPrice × quantity`

### Get Cart

**Endpoint:** `GET /api/customers/cart`

**Authorization:** `Bearer {customer_token}`

**Response:**

```json
{
  "items": [
    {
      "id": 1,
      "menuItemId": 1,
      "itemName": "Dal Makhani",
      "quantity": 2,
      "itemPrice": 150.0,
      "itemTotal": 300.0,
      "specialInstructions": "Less spicy please",
      "providerId": 1,
      "providerName": "Tasty Tiffins"
    },
    {
      "id": 2,
      "menuItemId": 3,
      "itemName": "Butter Naan",
      "quantity": 4,
      "itemPrice": 30.0,
      "itemTotal": 120.0,
      "providerId": 1,
      "providerName": "Tasty Tiffins"
    }
  ],
  "subtotal": 420.0,
  "totalItems": 6,
  "groupedByProvider": {
    "1": [
      {
        "id": 1,
        "itemName": "Dal Makhani",
        "quantity": 2,
        "itemTotal": 300.0
      },
      {
        "id": 2,
        "itemName": "Butter Naan",
        "quantity": 4,
        "itemTotal": 120.0
      }
    ]
  }
}
```

**Response Fields:**

- `items`: All cart items
- `subtotal`: Total of all items
- `totalItems`: Total quantity of items
- `groupedByProvider`: Items grouped by provider ID

### Update Cart Item

**Endpoint:** `PUT /api/customers/cart/{cartItemId}`

**Authorization:** `Bearer {customer_token}`

**Request Body:**

```json
{
  "quantity": 3,
  "specialInstructions": "Extra spicy"
}
```

**Response:**

```json
{
  "id": 1,
  "menuItemId": 1,
  "itemName": "Dal Makhani",
  "quantity": 3,
  "itemPrice": 150.0,
  "itemTotal": 450.0,
  "specialInstructions": "Extra spicy"
}
```

### Remove Cart Item

**Endpoint:** `DELETE /api/customers/cart/{cartItemId}`

**Authorization:** `Bearer {customer_token}`

**Response:** `204 No Content`

### Clear Cart

**Endpoint:** `DELETE /api/customers/cart`

**Authorization:** `Bearer {customer_token}`

**Response:** `204 No Content`

**Removes all items from cart**

---

## Order Creation & Payment

### Create Order

**Endpoint:** `POST /api/customers/orders`

**Authorization:** `Bearer {customer_token}`

**Request Body:**

```json
{
  "cartItemIds": [1, 2],
  "deliveryAddress": "123 Main Street, Mumbai, Maharashtra, 400001",
  "deliveryFee": 30.0
}
```

**Field Explanations:**

- `cartItemIds`: Array of cart item IDs to include in order
- `deliveryAddress`: Full delivery address as string
- `deliveryFee`: Delivery fee (usually calculated by frontend)

**Response:**

```json
{
  "id": 1,
  "customerId": 1,
  "providerId": 1,
  "providerName": "Tasty Tiffins",
  "orderStatus": "PENDING",
  "cartItems": [
    {
      "cartItemId": 1,
      "itemName": "Dal Makhani",
      "quantity": 2,
      "itemPrice": 150.0,
      "itemTotal": 300.0
    },
    {
      "cartItemId": 2,
      "itemName": "Butter Naan",
      "quantity": 4,
      "itemPrice": 30.0,
      "itemTotal": 120.0
    }
  ],
  "subtotal": 420.0,
  "deliveryFee": 30.0,
  "platformCommission": 21.0,
  "totalAmount": 471.0,
  "deliveryAddress": "123 Main Street, Mumbai, Maharashtra, 400001",
  "orderTime": "2024-01-15T12:00:00",
  "estimatedDeliveryTime": "2024-01-15T13:00:00"
}
```

**What Happens:**

- Order is created with status `PENDING`
- Cart items are converted to order items
- Platform commission is calculated (usually 5% of subtotal)
- Total amount = subtotal + deliveryFee + platformCommission
- Estimated delivery time is set

**Important:**

- Cart items are NOT automatically removed after order creation
- You may want to clear cart after successful order

### Create Payment Order (Razorpay)

**Endpoint:** `POST /api/customers/payments/orders/{orderId}`

**Authorization:** `Bearer {customer_token}`

**Response:**

```json
{
  "razorpayOrderId": "order_ABC123",
  "amount": 47100,
  "currency": "INR"
}
```

**Field Explanations:**

- `razorpayOrderId`: Razorpay order ID for payment
- `amount`: Amount in paise (471.00 INR = 47100 paise)
- `currency`: Currency code (INR)

**Use Case:**

- Use this to initialize Razorpay payment
- Pass `razorpayOrderId` to Razorpay checkout
- After payment, Razorpay webhook will update order status

### Get Payment Order

**Endpoint:** `GET /api/customers/payments/orders/{orderId}`

**Authorization:** `Bearer {customer_token}`

**Response:** Same as create payment order

---

## Order Tracking

### Get All My Orders

**Endpoint:** `GET /api/customers/orders`

**Authorization:** `Bearer {customer_token}`

**Response:**

```json
[
  {
    "id": 1,
    "customerId": 1,
    "providerId": 1,
    "providerName": "Tasty Tiffins",
    "orderStatus": "CONFIRMED",
    "subtotal": 420.0,
    "deliveryFee": 30.0,
    "platformCommission": 21.0,
    "totalAmount": 471.0,
    "deliveryAddress": "123 Main Street, Mumbai",
    "orderTime": "2024-01-15T12:00:00",
    "estimatedDeliveryTime": "2024-01-15T13:00:00",
    "cartItems": [...]
  }
]
```

### Get Order by ID

**Endpoint:** `GET /api/customers/orders/{id}`

**Authorization:** `Bearer {customer_token}`

**Response:** Same as above but for single order

### Cancel Order

**Endpoint:** `POST /api/customers/orders/{id}/cancel`

**Authorization:** `Bearer {customer_token}`

**Response:**

```json
{
  "id": 1,
  "orderStatus": "CANCELLED",
  "totalAmount": 471.0
}
```

**Note:** Customer can only cancel orders in `PENDING` or `CONFIRMED` status

### Order Status Flow (Customer View)

```
PENDING → CONFIRMED → PREPARING → READY → OUT_FOR_DELIVERY → DELIVERED
   ↓
CANCELLED (can cancel at PENDING or CONFIRMED)
```

---

## Complete Postman Testing Guide

### Prerequisites

1. **Postman Environment Setup**

   - Create environment: "PlateMate Local"
   - Variables:
     - `base_url`: `http://localhost:9090`
     - `customer_token`: (set after customer login)
     - `customer_user_id`: (set after customer signup)
     - `customer_id`: (set after creating profile)
     - `menu_item_id`: (set after browsing menu)
     - `cart_item_id`: (set after adding to cart)
     - `order_id`: (set after creating order)

2. **Setup Required** (Do these first):
   - At least one provider exists and is approved
   - At least one category exists
   - At least one menu item exists

---

## Step-by-Step Postman Testing

### Phase 1: Customer Registration

#### Step 1.1: Customer Signup

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

**Expected Response:**

```json
{
  "message": "User created successfully",
  "userId": 2,
  "username": "customer1"
}
```

**Action:** Save `userId` → Set `customer_user_id` = 2

#### Step 1.2: Customer Login

```
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "username": "customer1",
  "password": "customer123"
}
```

**Expected Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "...",
  "username": "customer1",
  "role": "ROLE_CUSTOMER"
}
```

**Action:** Copy `token` → Set `customer_token`

#### Step 1.3: Create Customer Profile

```
POST {{base_url}}/api/customers
Authorization: Bearer {{customer_token}}
Content-Type: application/json

{
  "userId": {{customer_user_id}},
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-15"
}
```

**Expected Response:**

```json
{
  "id": 1,
  "userId": 2,
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-15"
}
```

**Action:** Save `id` → Set `customer_id` = 1

#### Step 1.4: Add Address (Optional)

```
POST {{base_url}}/api/users/{{customer_user_id}}/address
Authorization: Bearer {{customer_token}}
Content-Type: application/json

{
  "street1": "123 Main Street",
  "street2": "Apartment 4B",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "address_type": "HOME"
}
```

---

### Phase 2: Browsing Menu Items

#### Step 2.1: Get All Menu Items

```
GET {{base_url}}/api/customers/menu-items?page=0&size=10
```

**Expected Response:**

```json
{
  "content": [
    {
      "id": 1,
      "itemName": "Dal Makhani",
      "price": 150.0,
      "providerBusinessName": "Tasty Tiffins"
    }
  ],
  "totalElements": 10,
  "totalPages": 1
}
```

**Action:** Save a `menu_item_id` → Set `menu_item_id` = 1

#### Step 2.2: Get Categories

```
GET {{base_url}}/api/categories
Authorization: Bearer {{customer_token}}
```

#### Step 2.3: Get Menu Items by Category

```
GET {{base_url}}/api/customers/menu-items/category/1?page=0&size=10
```

#### Step 2.4: Search Menu Items

```
GET {{base_url}}/api/customers/menu-items/search?q=dal&page=0&size=10
```

#### Step 2.5: Get Menu Item by ID

```
GET {{base_url}}/api/customers/menu-items/{{menu_item_id}}
```

---

### Phase 3: Cart Management

#### Step 3.1: Add Item to Cart

```
POST {{base_url}}/api/customers/cart
Authorization: Bearer {{customer_token}}
Content-Type: application/json

{
  "menuItemId": {{menu_item_id}},
  "quantity": 2,
  "specialInstructions": "Less spicy please"
}
```

**Expected Response:**

```json
{
  "id": 1,
  "menuItemId": 1,
  "itemName": "Dal Makhani",
  "quantity": 2,
  "itemPrice": 150.0,
  "itemTotal": 300.0,
  "specialInstructions": "Less spicy please"
}
```

**Action:** Save `id` → Set `cart_item_id` = 1

#### Step 3.2: Get Cart

```
GET {{base_url}}/api/customers/cart
Authorization: Bearer {{customer_token}}
```

**Expected Response:**

```json
{
  "items": [
    {
      "id": 1,
      "itemName": "Dal Makhani",
      "quantity": 2,
      "itemTotal": 300.0
    }
  ],
  "subtotal": 300.0,
  "totalItems": 2
}
```

#### Step 3.3: Update Cart Item

```
PUT {{base_url}}/api/customers/cart/{{cart_item_id}}
Authorization: Bearer {{customer_token}}
Content-Type: application/json

{
  "quantity": 3,
  "specialInstructions": "Extra spicy"
}
```

#### Step 3.4: Remove Cart Item

```
DELETE {{base_url}}/api/customers/cart/{{cart_item_id}}
Authorization: Bearer {{customer_token}}
```

#### Step 3.5: Add More Items (Optional)

```
POST {{base_url}}/api/customers/cart
Authorization: Bearer {{customer_token}}
Content-Type: application/json

{
  "menuItemId": 2,
  "quantity": 1
}
```

---

### Phase 4: Order Creation

#### Step 4.1: Get Cart (to get cart item IDs)

```
GET {{base_url}}/api/customers/cart
Authorization: Bearer {{customer_token}}
```

**Note the cart item IDs from response**

#### Step 4.2: Create Order

```
POST {{base_url}}/api/customers/orders
Authorization: Bearer {{customer_token}}
Content-Type: application/json

{
  "cartItemIds": [1, 2],
  "deliveryAddress": "123 Main Street, Mumbai, Maharashtra, 400001",
  "deliveryFee": 30.0
}
```

**Expected Response:**

```json
{
  "id": 1,
  "orderStatus": "PENDING",
  "subtotal": 420.0,
  "deliveryFee": 30.0,
  "platformCommission": 21.0,
  "totalAmount": 471.0,
  "orderTime": "2024-01-15T12:00:00"
}
```

**Action:** Save `id` → Set `order_id` = 1

#### Step 4.3: Create Payment Order

```
POST {{base_url}}/api/customers/payments/orders/{{order_id}}
Authorization: Bearer {{customer_token}}
```

**Expected Response:**

```json
{
  "razorpayOrderId": "order_ABC123",
  "amount": 47100,
  "currency": "INR"
}
```

**✅ Order created and payment initialized!**

---

### Phase 5: Order Tracking

#### Step 5.1: Get All My Orders

```
GET {{base_url}}/api/customers/orders
Authorization: Bearer {{customer_token}}
```

**Expected Response:**

```json
[
  {
    "id": 1,
    "orderStatus": "PENDING",
    "totalAmount": 471.0,
    "orderTime": "2024-01-15T12:00:00"
  }
]
```

#### Step 5.2: Get Order Details

```
GET {{base_url}}/api/customers/orders/{{order_id}}
Authorization: Bearer {{customer_token}}
```

#### Step 5.3: Cancel Order (If Needed)

```
POST {{base_url}}/api/customers/orders/{{order_id}}/cancel
Authorization: Bearer {{customer_token}}
```

**Note:** Can only cancel if status is `PENDING` or `CONFIRMED`

---

## Complete Testing Flow Summary

### ✅ Registration Flow

1. ✅ Signup as customer
2. ✅ Login and get token
3. ✅ Create customer profile
4. ✅ Add address (optional)

### ✅ Browsing Flow

5. ✅ Get all menu items
6. ✅ Get categories
7. ✅ Search menu items
8. ✅ Get menu item by ID

### ✅ Cart Management Flow

9. ✅ Add item to cart
10. ✅ Get cart
11. ✅ Update cart item
12. ✅ Remove cart item
13. ✅ Clear cart

### ✅ Order Flow

14. ✅ Create order
15. ✅ Create payment order
16. ✅ Get all orders
17. ✅ Get order details
18. ✅ Cancel order (if applicable)

---

## Common Errors & Solutions

### Error 1: "Customer profile not found for user"

**Cause:** Trying to add to cart before creating customer profile  
**Solution:** Create customer profile first using `POST /api/customers`

### Error 2: "Menu item not found"

**Cause:** Menu item ID doesn't exist or item is deleted  
**Solution:** Verify menu item exists using `GET /api/customers/menu-items/{id}`

### Error 3: "Cart item not found"

**Cause:** Cart item ID doesn't exist or belongs to another customer  
**Solution:** Get cart first to see valid cart item IDs

### Error 4: "Order can only be cancelled if it is PENDING or CONFIRMED"

**Cause:** Trying to cancel order in wrong status  
**Solution:** Check order status first, only cancel if PENDING or CONFIRMED

### Error 5: "Order not found"

**Cause:** Order ID doesn't exist or belongs to another customer  
**Solution:** Verify order exists using `GET /api/customers/orders`

---

## Customer Dashboard APIs Summary

For building a customer app in React, you'll need:

```javascript
// Profile Management
GET / api / customers / { id }; // Get my profile
PUT / api / customers / { id }; // Update profile
POST / api / users / { userId } / address; // Add/update address

// Menu Browsing
GET / api / customers / menu - items; // Browse all items (paginated)
GET / api / customers / menu - items / { id }; // Get item details
GET / api / customers / menu - items / search; // Search items
GET / api / customers / menu - items / provider / { id }; // Items by provider
GET / api / customers / menu - items / category / { id }; // Items by category
GET / api / categories; // Get all categories

// Cart Management
GET / api / customers / cart; // Get cart
POST / api / customers / cart; // Add to cart
PUT / api / customers / cart / { id }; // Update cart item
DELETE / api / customers / cart / { id }; // Remove cart item
DELETE / api / customers / cart; // Clear cart

// Order Management
POST / api / customers / orders; // Create order
GET / api / customers / orders; // Get all my orders
GET / api / customers / orders / { id }; // Get order details
POST / api / customers / orders / { id } / cancel; // Cancel order

// Payment
POST / api / customers / payments / orders / { id }; // Create payment order
GET / api / customers / payments / orders / { id }; // Get payment order
```

---

## Order Status Flow (Complete)

```
PENDING (Order created, waiting for provider)
   ↓
CONFIRMED (Provider accepts order)
   ↓
PREPARING (Provider starts cooking)
   ↓
READY (Food is ready for pickup)
   ↓
OUT_FOR_DELIVERY (Delivery partner picked up)
   ↓
DELIVERED (Order completed)
```

**Customer Actions:**

- Can view all their orders
- Can cancel orders in `PENDING` or `CONFIRMED` status
- Can track order status in real-time
- Cannot modify order after creation

---

## Testing Checklist

### Registration & Profile

- [ ] Signup customer user
- [ ] Login customer
- [ ] Create customer profile
- [ ] Add address

### Browsing

- [ ] Get all menu items
- [ ] Get categories
- [ ] Search menu items
- [ ] Get menu items by provider
- [ ] Get menu items by category
- [ ] Get menu item by ID

### Cart Management

- [ ] Add item to cart
- [ ] Get cart
- [ ] Update cart item
- [ ] Remove cart item
- [ ] Clear cart

### Order Creation

- [ ] Create order
- [ ] Create payment order
- [ ] Get order details

### Order Tracking

- [ ] Get all orders
- [ ] Get order by ID
- [ ] Cancel order (if applicable)

---

## Complete Example Request/Response

### Create Customer Profile

**Request:**

```json
POST /api/customers
Authorization: Bearer {token}

{
  "userId": 2,
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-15"
}
```

**Response:**

```json
{
  "id": 1,
  "userId": 2,
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-15"
}
```

### Add to Cart

**Request:**

```json
POST /api/customers/cart
Authorization: Bearer {token}

{
  "menuItemId": 1,
  "quantity": 2,
  "specialInstructions": "Less spicy"
}
```

**Response:**

```json
{
  "id": 1,
  "menuItemId": 1,
  "itemName": "Dal Makhani",
  "quantity": 2,
  "itemPrice": 150.0,
  "itemTotal": 300.0,
  "specialInstructions": "Less spicy"
}
```

### Create Order

**Request:**

```json
POST /api/customers/orders
Authorization: Bearer {token}

{
  "cartItemIds": [1, 2],
  "deliveryAddress": "123 Main Street, Mumbai, 400001",
  "deliveryFee": 30.0
}
```

**Response:**

```json
{
  "id": 1,
  "orderStatus": "PENDING",
  "subtotal": 420.0,
  "deliveryFee": 30.0,
  "platformCommission": 21.0,
  "totalAmount": 471.0,
  "orderTime": "2024-01-15T12:00:00"
}
```

---

This guide provides complete understanding of customer flow. Test each step in Postman to understand the data flow before building your customer mobile app or web application.
