# Android App Flow Documentation for React+TypeScript Implementation

This document describes the complete flow of the Android PlateMate application to guide the implementation of a React+TypeScript web frontend. **The backend remains unchanged** - only the frontend UI needs to be implemented.

---

## Table of Contents

1. [Application Architecture](#application-architecture)
2. [Authentication Flow](#authentication-flow)
3. [Customer Flow](#customer-flow)
4. [Provider Flow](#provider-flow)
5. [Delivery Partner Flow](#delivery-partner-flow)
6. [API Endpoints & DTOs](#api-endpoints--dtos)
7. [Business Logic Rules](#business-logic-rules)
8. [Key Components & Features](#key-components--features)

---

## Application Architecture

### Entry Point & Navigation

**Splash Screen (SplashActivity)**
- **Purpose**: Initial entry point, checks authentication status
- **Flow**:
  1. Check if user is logged in via `SessionManager`
  2. **If logged in**: Route based on role:
     - `Provider` → Check profile completion → `ProviderDetailsActivity` (if incomplete) or `ProviderDashboardActivity`
     - `Delivery` → `DeliveryPartnerDashboardActivity`
     - `Customer` → `CustomerHomeActivity`
  3. **If not logged in**: Show splash with Sign Up/Sign In options

**Main Activity (MainActivity)**
- **Purpose**: Router after login, validates session
- **Flow**:
  1. Check if logged in, redirect to Login if not
  2. Get role from session
  3. For Providers: Check onboarding status via API (`/api/provider/profile-complete`)
  4. Route to appropriate dashboard based on role

### Session Management

**SessionManager** (SharedPreferences-based)
- **Stores**:
  - `auth_token` (JWT)
  - `refresh_token`
  - `user_role` (Customer/Provider/Delivery)
  - `username`
  - `user_id`
  - `profile_complete` (boolean)
- **Key Methods**:
  - `saveLoginSession(token, refreshToken, role, username, userId)`
  - `isLoggedIn()` → boolean
  - `getRole()` → string
  - `getToken()` → string
  - `logout()` → clears all session data

### API Client Setup

**RetrofitClient** (Singleton)
- **Base URL**: `http://10.0.2.2:8080` (for web: use actual backend URL)
- **Interceptors**:
  1. **AuthInterceptor**: Adds `Authorization: Bearer {token}` header to all requests
  2. **TokenRefreshInterceptor**: 
     - Detects 401 responses
     - Calls `/api/auth/refresh` with refresh token
     - Updates tokens and retries original request
     - On refresh failure: Logout and redirect to login

---

## Authentication Flow

### 1. Sign Up Flow

**Screen**: SignUpActivity

**User Input**:
- Username
- Email
- Password
- Confirm Password
- Phone (10 digits)
- Role (Customer/Provider/Delivery)

**Validation**:
- Email format validation
- Password: min 6 chars, must have uppercase, lowercase, digit, special character
- Phone: exactly 10 digits
- Password match validation

**API Call**:
```
POST /api/auth/signup
Body: {
  username: string,
  email: string,
  password: string,
  phone: string,
  role: "ROLE_CUSTOMER" | "ROLE_PROVIDER" | "ROLE_DELIVERY"
}
Response: {
  token: string,
  refreshToken: string,
  role: string,
  username: string,
  userId: number
}
```

**Business Logic**:
- Map UI role to backend format:
  - "Customer" → "ROLE_CUSTOMER"
  - "Provider" → "ROLE_PROVIDER"
  - "Delivery" → "ROLE_DELIVERY"
- On success: Redirect to LoginActivity with username pre-filled

### 2. Login Flow

**Screen**: LoginActivity

**User Input**:
- Username
- Password

**API Call**:
```
POST /api/auth/login
Body: {
  username: string,
  password: string
}
Response: {
  token: string,
  refreshToken: string,
  role: string,
  username: string,
  userId: number
}
```

**Business Logic**:
1. Save session: `SessionManager.saveLoginSession(token, refreshToken, role, username, userId)`
2. Normalize role: "Delivery Partner" → "Delivery"
3. **For Providers**: Check profile completion
   - Call `GET /api/provider/profile-complete`
   - If `isComplete: false` → Redirect to `ProviderDetailsActivity`
   - If `isComplete: true` → Redirect to `ProviderDashboardActivity`
4. **For other roles**: Redirect to respective dashboard

### 3. Password Reset Flow

**Step 1: Forgot Password (ForgotPasswordActivity)**
```
POST /api/auth/forgot-password
Body: {
  username?: string,
  email?: string
}
Response: {
  message: string
}
```
- User enters username OR email
- OTP sent to registered email/phone
- Navigate to ResetPasswordActivity

**Step 2: Verify OTP (ResetPasswordActivity)**
```
POST /api/auth/verify-otp
Body: {
  username?: string,
  email?: string,
  otp: string
}
Response: {
  message: string,
  verified: boolean
}
```

**Step 3: Resend OTP (if needed)**
```
POST /api/auth/resend-otp
Body: {
  username?: string,
  email?: string
}
```

**Step 4: Reset Password**
```
POST /api/auth/reset-password
Body: {
  username?: string,
  email?: string,
  otp: string,
  newPassword: string
}
Response: {
  message: string
}
```

### 4. Token Refresh Flow

**Automatic (via Interceptor)**:
1. Request returns 401
2. Interceptor catches it
3. Call `POST /api/auth/refresh` with refresh token
4. Update tokens in SessionManager
5. Retry original request with new token
6. If refresh fails: Logout and redirect to login

---

## Customer Flow

### 1. Customer Home Screen

**Screen**: CustomerHomeActivity

**Layout**:
- Header: Welcome message, username, logout button, cart button
- Search bar
- "Today's Best Food" horizontal scroll (RecyclerView)
- "Choose Category" grid (2 columns)
- Bottom Navigation: Home, Orders, Profile

**API Calls on Load**:
```
GET /api/customers/menu-items?page=0&size=20&sort=id,desc
Response: {
  content: MenuItem[],
  page: number,
  size: number,
  totalElements: number,
  totalPages: number
}

GET /api/categories
Response: Category[]
```

**Features**:
- **Add to Cart**: Click on menu item → `POST /api/customers/cart`
- **View All Products**: Navigate to AllProductsActivity
- **Category Filter**: Click category → Navigate to AllProductsActivity with category filter
- **Swipe to Refresh**: Reload menu items and categories

### 2. Product Browsing

**All Products Screen (AllProductsActivity)**
- **Search**: `GET /api/customers/menu-items/search?q={query}&page=0&size=20&sort=id,desc`
- **Category Filter**: `GET /api/customers/menu-items/category/{categoryId}?page=0&size=20&sort=id,desc`
- **Pagination**: Load more items as user scrolls

### 3. Product Detail Screen

**Screen**: ProductDetailActivity

**API Call**:
```
GET /api/customers/menu-items/{id}
Response: MenuItem {
  id: number,
  itemName: string,
  description: string,
  price: number,
  ingredients: string,
  mealType: "VEG" | "NON_VEG" | "JAIN",
  categoryName: string,
  providerName: string,
  providerBusinessName: string,
  imageBase64List: string[],
  imageFileTypeList: string[],
  averageRating: number,
  ratingCount: number,
  hasUserRated: boolean,
  unitsOfMeasurement: number,
  maxQuantity: number
}
```

**Features**:
- Display product details, images (decode base64)
- **Add to Cart**: `POST /api/customers/cart`
- **View Reviews**: `GET /api/ratings/menu-item/{menuItemId}`
- **Rate Product**: 
  - Only if `hasUserRated: false`
  - Requires delivered order containing this item
  - `POST /api/customers/ratings/menu-item` with orderId, menuItemId, rating, review

### 4. Cart Management

**Screen**: CartActivity

**API Call**:
```
GET /api/customers/cart
Response: {
  items: CartItem[],
  subtotal: number
}
```

**CartItem Structure**:
```
{
  id: number,
  menuItemId: number,
  itemName: string,
  quantity: number,
  itemPrice: number,
  itemTotal: number,
  specialInstructions: string,
  providerId: number,
  providerName: string
}
```

**Features**:
- **Update Quantity**: `PUT /api/customers/cart/{cartItemId}` with new quantity
- **Remove Item**: `DELETE /api/customers/cart/{cartItemId}`
- **Clear Cart**: `DELETE /api/customers/cart`

**Order Summary Calculation**:
- Subtotal: Sum of all `itemTotal`
- Delivery Fee: ₹30.00 (fixed)
- Tax (GST): 5% of subtotal
- Total: Subtotal + Delivery Fee + Tax

**Business Rule**: All cart items must be from the same provider. If different providers, show error on checkout.

### 5. Checkout Flow

**Screen**: CheckoutActivity

**Step 1: Address Management**
- Load address: `GET /api/users/{userId}` → get `address` field
- If no address: Show "Add Address" button
- Save/Update: `POST /api/users/{userId}/address`
- Address fields: street, city, state, zipCode

**Step 2: Payment Method Selection**
- Radio buttons: Cash on Delivery (CASH) or Razorpay (UPI)
- Default: CASH

**Step 3: Place Order**

**For CASH Payment**:
```
POST /api/customers/orders
Body: {
  cartItemIds: number[],
  deliveryAddress: string,
  deliveryFee: 30.0,
  paymentMethod: "CASH"
}
Response: Order
```
- Order created immediately with status PENDING
- Navigate to CustomerHomeActivity

**For Razorpay Payment**:
1. Create order first:
   ```
   POST /api/customers/orders
   Body: {
     cartItemIds: number[],
     deliveryAddress: string,
     deliveryFee: 30.0,
     paymentMethod: "UPI"
   }
   Response: Order { id: number }
   ```

2. Initialize payment:
   ```
   POST /api/customers/payments/orders/{orderId}
   Response: {
     razorpayOrderId: string
   }
   ```

3. Open Razorpay checkout (use Razorpay SDK/Web)

4. On payment success:
   ```
   POST /api/payments/verify/{orderId}
   Body: {
     razorpayPaymentId: string,
     razorpayOrderId: string,
     signature: string
   }
   Response: Order
   ```

5. Navigate to CustomerHomeActivity

### 6. Customer Orders

**Screen**: CustomerOrdersFragment

**API Call**:
```
GET /api/customers/orders
Response: Order[]
```

**Order Structure**:
```
{
  id: number,
  customerId: number,
  providerId: number,
  providerName: string,
  deliveryPartnerId: number,
  deliveryPartnerName: string,
  orderStatus: "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED",
  cartItems: OrderItem[],
  subtotal: number,
  deliveryFee: number,
  platformCommission: number,
  totalAmount: number,
  deliveryAddress: string,
  orderTime: string,
  estimatedDeliveryTime: string,
  deliveryTime: string
}
```

**Features**:
- View order history
- **Order Details**: `GET /api/customers/orders/{id}`
- **Cancel Order**: `POST /api/customers/orders/{id}/cancel` (only if status is PENDING)

### 7. Customer Profile

**Screen**: CustomerProfileFragment

**API Calls**:
```
GET /api/users/{id}
Response: User {
  id: number,
  username: string,
  email: string,
  phone: string,
  role: string,
  address: Address,
  profileImageId: number
}

PUT /api/users/{id}
Body: User

PUT /api/customers/{id}
Body: {
  fullName: string,
  dateOfBirth: string
}

POST /api/users/{id}/profile-image
Body: MultipartFile
```

**Features**:
- View/edit profile
- Update address
- Upload profile image

---

## Provider Flow

### 1. Provider Onboarding

**Screen**: ProviderDetailsActivity

**Purpose**: First-time profile completion (blocked until complete)

**Onboarding Check**:
```
GET /api/provider/profile-complete
Response: {
  isComplete: boolean,
  isOnboarding: boolean
}
```

**If `isOnboarding: true`**: Block back navigation, show "Complete Your Profile" title

**Form Fields**:
- Business Name (required)
- Description (required)
- Commission Rate (required, number)
- Zone (required, dropdown from delivery zones)
- Provides Delivery (checkbox)
- Delivery Radius (required if provides delivery)
- Address:
  - Street (required)
  - City (required)
  - State (required)
  - Zip Code (required)

**Load Delivery Zones**:
```
GET /api/delivery-zones
Response: DeliveryZone[] {
  id: number,
  zoneName: string,
  city: string,
  state: string,
  pincodeRanges: string[]
}
```

**Business Logic**:
- When zone selected: Auto-populate city, state, zipCode from zone
- Zone dropdown shows: `"{zoneName} - {city}"`

**Save Provider Details**:
```
POST /api/provider/details
Body: {
  user: userId,
  businessName: string,
  description: string,
  commissionRate: number,
  providesDelivery: boolean,
  deliveryRadius?: number,
  zone: zoneId,
  address: {
    street: string,
    city: string,
    state: string,
    zipCode: string
  }
}
Response: {
  ...provider details,
  isOnboarding: false
}
```

**On Success**:
- Set `profileComplete: true` in SessionManager
- Navigate to ProviderDashboardActivity
- Show welcome message

### 2. Provider Dashboard

**Screen**: ProviderDashboardActivity

**Layout**:
- Header: Profile picture, business name, email
- Stats Cards: Total Products, Active Orders, Pending Amount
- Products List (RecyclerView)
- Floating Action Button (FAB) - Add Product (only if approved)
- Bottom Navigation: Dashboard, Orders, Products, Profile

**API Calls on Load**:
```
GET /api/provider/details
Response: {
  businessName: string,
  description: string,
  isApproved: boolean,
  isVerified: boolean,
  ...
}

GET /api/users/{userId}
Response: User { profileImageId: number }

GET /images/view/{profileImageId}
Response: Image bytes

GET /api/providers/menu-items
Response: MenuItemResponse[]

GET /api/providers/payouts/pending
Response: {
  pendingAmount: number
}
```

**Business Logic**:
- **FAB Visibility**: Only show if `isApproved: true` or `isVerified: true`
- **Approval Notification**: Show dialog when approval status changes from false to true
- Convert MenuItemResponse to Product format for display

**Features**:
- Swipe to refresh
- Click product → Edit/Delete
- Click FAB → AddProductActivity

### 3. Product Management

**Add Product (AddProductActivity)**

**Form Fields**:
- Item Name (required)
- Description (required)
- Price (required, number)
- Category (required, dropdown)
- Meal Type (VEG/NON_VEG/JAIN)
- Ingredients
- Units of Measurement (grams)
- Max Quantity
- Image (optional, file upload)
- Is Available (checkbox)

**API Call**:
```
POST /api/providers/menu-items
Content-Type: multipart/form-data
Body:
  - data: JSON string {
      itemName: string,
      description: string,
      price: number,
      categoryId: number,
      mealType: string,
      ingredients: string,
      unitsOfMeasurement: number,
      maxQuantity: number,
      isAvailable: boolean
    }
  - image: File (optional)
Response: MenuItemResponse
```

**Edit Product (activity_provider_product.java)**

**API Calls**:
```
GET /api/providers/menu-items/{id}
Response: MenuItemResponse

PUT /api/providers/menu-items/{id}
Content-Type: multipart/form-data
Body: same as create

DELETE /api/providers/menu-items/{id}
Response: void
```

### 4. Provider Orders

**Screen**: OrdersFragment

**API Call**:
```
GET /api/providers/orders
Response: Order[]
```

**Features**:
- View all orders
- **Order Details**: `GET /api/providers/orders/{id}`
- **Update Status**: 
  ```
  PUT /api/providers/orders/{id}/status
  Body: {
    status: "CONFIRMED" | "PREPARING" | "READY"
  }
  ```
- **Assign Delivery Partner**:
  ```
  GET /api/providers/delivery-partners/available
  Response: DeliveryPartner[]
  
  POST /api/providers/orders/{orderId}/assign-delivery/{deliveryPartnerId}
  Response: Order
  ```

**Order Status Flow**:
- PENDING → CONFIRMED (Provider confirms)
- CONFIRMED → PREPARING (Provider starts preparing)
- PREPARING → READY (Provider marks ready)
- READY → OUT_FOR_DELIVERY (Delivery partner picks up)
- OUT_FOR_DELIVERY → DELIVERED (Delivery partner delivers)

### 5. Delivery Partner Management

**Screen**: DeliveryPartnersActivity

**API Calls**:
```
GET /api/providers/delivery-partners
Response: DeliveryPartner[]

GET /api/providers/delivery-partners/available
Response: DeliveryPartner[]

GET /api/providers/delivery-partners/{id}
Response: DeliveryPartner

POST /api/providers/delivery-partners
Body: {
  name: string,
  phone: string,
  email: string,
  vehicleNumber: string,
  licenseNumber: string,
  zoneId: number
}
Response: DeliveryPartner

PUT /api/providers/delivery-partners/{id}
Body: DeliveryPartnerUpdateRequest

DELETE /api/providers/delivery-partners/{id}
Response: void
```

### 6. Provider Profile

**Screen**: ProviderProfileFragment

**API Calls**:
```
GET /api/provider/details
Response: Map with provider details

POST /api/provider/details
Body: Map with provider details

POST /api/tiffin-providers/{id}/profile-image
Body: MultipartFile
```

---

## Delivery Partner Flow

### 1. Delivery Partner Dashboard

**Screen**: DeliveryPartnerDashboardActivity

**Layout**: TabLayout with 4 tabs:
1. My Orders (ASSIGNED)
2. Available Orders
3. Completed Orders
4. Profile

**Each tab uses**: DeliveryPartnerOrdersFragment (different instances)

### 2. Order Management

**My Orders Tab**:
```
GET /api/delivery-partners/orders
Response: Order[] (status: ASSIGNED, OUT_FOR_DELIVERY)
```

**Available Orders Tab**:
```
GET /api/delivery-partners/available-orders
Response: Order[] (unassigned or assigned to this partner, status: READY)
```

**Completed Orders Tab**:
- Filter orders with status: DELIVERED

**Order Actions**:

**Accept Order**:
```
POST /api/delivery-partners/orders/{id}/accept
Response: Order
```
- Assigns order to delivery partner
- Status changes to ASSIGNED

**Pickup Order**:
```
POST /api/delivery-partners/orders/{id}/pickup
Response: Order
```
- Status changes to OUT_FOR_DELIVERY

**Deliver Order**:
```
POST /api/delivery-partners/orders/{id}/deliver
Body: {
  otp: string
}
Response: Order
```
- Generates OTP if not exists
- Requires OTP verification

**Verify OTP**:
```
POST /api/delivery-partners/orders/{id}/verify-otp
Body: {
  otp: string
}
Response: {
  verified: boolean,
  message: string
}
```
- On success: Order status → DELIVERED

**Order Details**:
```
GET /api/delivery-partners/orders/{id}
Response: Order
```

### 3. Delivery Partner Profile

**Screen**: DeliveryPartnerProfileFragment

**API Calls**:
```
GET /api/delivery-partners/{id}
Response: DeliveryPartner {
  id: number,
  name: string,
  phone: string,
  email: string,
  vehicleNumber: string,
  licenseNumber: string,
  isAvailable: boolean,
  zone: DeliveryZone
}

PUT /api/delivery-partners/{id}
Body: {
  name: string,
  phone: string,
  email: string,
  vehicleNumber: string,
  licenseNumber: string,
  isAvailable: boolean,
  zoneId: number
}

POST /api/delivery-partners/{id}/profile-image
Body: MultipartFile
```

---

## API Endpoints & DTOs

### Authentication Endpoints

| Method | Endpoint | Request Body | Response |
|--------|----------|--------------|----------|
| POST | `/api/auth/login` | `{username, password}` | `{token, refreshToken, role, username, userId}` |
| POST | `/api/auth/signup` | `{username, email, password, phone, role}` | `{token, refreshToken, role, username, userId}` |
| POST | `/api/auth/refresh` | `{refreshToken}` | `{token, refreshToken}` |
| POST | `/api/auth/forgot-password` | `{username?, email?}` | `{message}` |
| POST | `/api/auth/resend-otp` | `{username?, email?}` | `{message}` |
| POST | `/api/auth/verify-otp` | `{username?, email?, otp}` | `{message, verified}` |
| POST | `/api/auth/reset-password` | `{username?, email?, otp, newPassword}` | `{message}` |

### Customer Endpoints

| Method | Endpoint | Request Body | Response |
|--------|----------|--------------|----------|
| GET | `/api/customers/menu-items` | Query: `page, size, sort` | `{content: MenuItem[], page, size, totalElements, totalPages}` |
| GET | `/api/customers/menu-items/{id}` | - | `MenuItem` |
| GET | `/api/customers/menu-items/category/{categoryId}` | Query: `page, size, sort` | `MenuItemResponse` |
| GET | `/api/customers/menu-items/search` | Query: `q, page, size, sort` | `MenuItemResponse` |
| GET | `/api/customers/cart` | - | `{items: CartItem[], subtotal: number}` |
| POST | `/api/customers/cart` | `{menuItemId, quantity, specialInstructions?}` | `CartItem` |
| PUT | `/api/customers/cart/{cartItemId}` | `{quantity, specialInstructions?}` | `CartItem` |
| DELETE | `/api/customers/cart/{cartItemId}` | - | `void` |
| DELETE | `/api/customers/cart` | - | `void` |
| POST | `/api/customers/orders` | `{cartItemIds, deliveryAddress, deliveryFee, paymentMethod}` | `Order` |
| GET | `/api/customers/orders` | - | `Order[]` |
| GET | `/api/customers/orders/{id}` | - | `Order` |
| POST | `/api/customers/orders/{id}/cancel` | - | `Order` |
| POST | `/api/customers/ratings/menu-item` | `{orderId, menuItemId, rating, review}` | `RatingReview` |
| PUT | `/api/customers/{id}` | `{fullName, dateOfBirth}` | `CustomerUpdateResponse` |

### Provider Endpoints

| Method | Endpoint | Request Body | Response |
|--------|----------|--------------|----------|
| GET | `/api/provider/details` | - | `Map<String, Object>` |
| POST | `/api/provider/details` | `{user, businessName, description, commissionRate, providesDelivery, deliveryRadius?, zone, address}` | `Map<String, Object>` |
| GET | `/api/provider/profile-complete` | - | `{isComplete, isOnboarding}` |
| GET | `/api/providers/menu-items` | - | `MenuItemResponse[]` |
| POST | `/api/providers/menu-items` | Multipart: `data` (JSON), `image` (File) | `MenuItemResponse` |
| PUT | `/api/providers/menu-items/{id}` | Multipart: `data` (JSON), `image` (File) | `MenuItemResponse` |
| DELETE | `/api/providers/menu-items/{id}` | - | `void` |
| GET | `/api/providers/menu-items/{id}` | - | `MenuItemResponse` |
| GET | `/api/providers/orders` | - | `Order[]` |
| GET | `/api/providers/orders/{id}` | - | `Order` |
| PUT | `/api/providers/orders/{id}/status` | `{status}` | `Order` |
| POST | `/api/providers/orders/{orderId}/assign-delivery/{deliveryPartnerId}` | - | `Order` |
| GET | `/api/providers/delivery-partners` | - | `DeliveryPartner[]` |
| GET | `/api/providers/delivery-partners/available` | - | `DeliveryPartner[]` |
| GET | `/api/providers/delivery-partners/{id}` | - | `DeliveryPartner` |
| POST | `/api/providers/delivery-partners` | `{name, phone, email, vehicleNumber, licenseNumber, zoneId}` | `DeliveryPartner` |
| PUT | `/api/providers/delivery-partners/{id}` | `DeliveryPartnerUpdateRequest` | `DeliveryPartner` |
| DELETE | `/api/providers/delivery-partners/{id}` | - | `void` |
| GET | `/api/providers/payouts/pending` | - | `{pendingAmount: number}` |
| POST | `/api/tiffin-providers/{id}/profile-image` | Multipart: `file` | `Image` |

### Delivery Partner Endpoints

| Method | Endpoint | Request Body | Response |
|--------|----------|--------------|----------|
| GET | `/api/delivery-partners/orders` | - | `Order[]` |
| GET | `/api/delivery-partners/available-orders` | - | `Order[]` |
| GET | `/api/delivery-partners/orders/{id}` | - | `Order` |
| POST | `/api/delivery-partners/orders/{id}/accept` | - | `Order` |
| POST | `/api/delivery-partners/orders/{id}/pickup` | - | `Order` |
| POST | `/api/delivery-partners/orders/{id}/deliver` | `{otp}` | `Order` |
| POST | `/api/delivery-partners/orders/{id}/verify-otp` | `{otp}` | `{verified, message}` |
| GET | `/api/delivery-partners` | - | `DeliveryPartner[]` |
| GET | `/api/delivery-partners/{id}` | - | `DeliveryPartner` |
| PUT | `/api/delivery-partners/{id}` | `DeliveryPartnerUpdateRequest` | `DeliveryPartner` |
| POST | `/api/delivery-partners/{id}/profile-image` | Multipart: `file` | `Image` |

### Common Endpoints

| Method | Endpoint | Request Body | Response |
|--------|----------|--------------|----------|
| GET | `/api/categories` | - | `Category[]` |
| GET | `/api/categories/{id}` | - | `Category` |
| GET | `/api/delivery-zones` | - | `DeliveryZone[]` |
| GET | `/api/users/{id}` | - | `User` |
| PUT | `/api/users/{id}` | `User` | `User` |
| POST | `/api/users/{userId}/address` | `{street, city, state, zipCode}` | `Address` |
| POST | `/api/users/{id}/profile-image` | Multipart: `file` | `Image` |
| GET | `/api/ratings/menu-item/{menuItemId}` | - | `RatingReview[]` |
| GET | `/api/ratings/menu-item/{menuItemId}/summary` | - | `{count, average}` |
| POST | `/api/customers/payments/orders/{orderId}` | - | `{razorpayOrderId}` |
| POST | `/api/payments/verify/{orderId}` | `{razorpayPaymentId, razorpayOrderId, signature}` | `Order` |
| POST | `/images/upload/{imageType}/{ownerId}` | Multipart: `file` | `Image` |
| GET | `/images/view/{id}` | - | `Image bytes` |

### Key DTOs

**MenuItem**:
```typescript
{
  id: number;
  categoryId: number;
  categoryName: string;
  itemName: string;
  description: string;
  price: number;
  ingredients: string;
  mealType: "VEG" | "NON_VEG" | "JAIN";
  providerId: number;
  providerName: string;
  providerBusinessName: string;
  imageBase64List: string[];
  imageFileTypeList: string[];
  unitsOfMeasurement: number;
  maxQuantity: number;
  averageRating: number;
  ratingCount: number;
  hasUserRated: boolean;
}
```

**CartItem**:
```typescript
{
  id: number;
  menuItemId: number;
  itemName: string;
  quantity: number;
  itemPrice: number;
  itemTotal: number;
  specialInstructions: string;
  providerId: number;
  providerName: string;
}
```

**Order**:
```typescript
{
  id: number;
  customerId: number;
  providerId: number;
  providerName: string;
  deliveryPartnerId: number;
  deliveryPartnerName: string;
  orderStatus: "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
  cartItems: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  platformCommission: number;
  totalAmount: number;
  deliveryAddress: string;
  orderTime: string;
  estimatedDeliveryTime: string;
  deliveryTime: string;
  hasOTP: boolean;
  otpExpiresAt: string;
}
```

**DeliveryZone**:
```typescript
{
  id: number;
  zoneName: string;
  city: string;
  state: string;
  pincodeRanges: string[];
}
```

---

## Business Logic Rules

### Authentication
1. **Role Normalization**: Backend may return "Delivery Partner", normalize to "Delivery" for UI
2. **Provider Onboarding**: Must complete profile before accessing dashboard
3. **Token Refresh**: Automatic via interceptor on 401 response
4. **Session Persistence**: Store in localStorage (web equivalent of SharedPreferences)

### Cart
1. **Same Provider Rule**: All cart items must be from the same provider
2. **Cart Calculation**:
   - Subtotal = Sum of all itemTotal
   - Delivery Fee = ₹30.00 (fixed)
   - Tax (GST) = 5% of subtotal
   - Total = Subtotal + Delivery Fee + Tax
3. **Optimistic Updates**: Update UI immediately, sync with server in background

### Orders
1. **Order Status Flow**:
   - PENDING → CONFIRMED → PREPARING → READY → OUT_FOR_DELIVERY → DELIVERED
   - Can be CANCELLED from PENDING status
2. **Payment Methods**:
   - CASH: Order created immediately
   - UPI (Razorpay): Order created, then payment processed
3. **OTP for Delivery**: Generated when delivery partner marks "Deliver", required for completion

### Products/Menu Items
1. **Provider Approval**: Provider must be `isApproved: true` to add products
2. **Image Handling**: Images sent as base64 strings in API responses
3. **Multiple Images**: Support multiple images per menu item
4. **Units**: Display in grams (unitsOfMeasurement)

### Ratings
1. **Rating Eligibility**: Only customers who received delivered orders can rate
2. **One Rating Per Item**: `hasUserRated` flag prevents duplicate ratings
3. **Rating Display**: Show average rating and count on product detail

### Address Management
1. **Auto-populate from Zone**: When zone selected, auto-fill city, state, zipCode
2. **Address Required**: Must have address before checkout
3. **Address Storage**: Save to backend and local storage (SessionManager equivalent)

### Provider Onboarding
1. **Blocked Navigation**: Cannot go back during onboarding
2. **Required Fields**: All fields must be filled
3. **Zone Selection**: Required, auto-populates address fields
4. **Onboarding Complete**: Set `isOnboarding: false` after save

---

## Key Components & Features

### UI Components to Implement

1. **Navigation**:
   - Bottom Navigation (Customer: Home, Orders, Profile)
   - Bottom Navigation (Provider: Dashboard, Orders, Products, Profile)
   - TabLayout (Delivery Partner: My Orders, Available, Completed, Profile)

2. **Lists/Grids**:
   - Horizontal scroll for "Best Foods"
   - Grid (2 columns) for Categories
   - Vertical list for Orders
   - Vertical list for Products

3. **Forms**:
   - Sign Up form with validation
   - Login form
   - Address form (with auto-populate from zone)
   - Product form (with image upload)
   - Provider details form

4. **Modals/Dialogs**:
   - Address dialog
   - Rating dialog
   - OTP verification dialog
   - Assign delivery partner dialog
   - Confirmation dialogs

5. **Payment Integration**:
   - Razorpay checkout integration
   - Payment success/failure handling

### Features to Implement

1. **Search**: Search menu items by name
2. **Filter**: Filter by category
3. **Pagination**: Load more items on scroll
4. **Swipe to Refresh**: Pull to refresh data
5. **Image Handling**: 
   - Decode base64 images
   - Upload images (multipart)
   - Display images in cards/lists
6. **Real-time Updates**: Refresh order status periodically
7. **Notifications**: Show approval notifications, order updates
8. **Empty States**: Show empty state when no data
9. **Loading States**: Show loading indicators during API calls
10. **Error Handling**: Display user-friendly error messages

### State Management (React)

**Recommended Structure**:
- **Auth Store**: Token, user info, role, login status
- **Cart Store**: Cart items, subtotal
- **Order Store**: Orders list, current order
- **Product Store**: Menu items, categories
- **Provider Store**: Provider details, products, orders
- **Delivery Partner Store**: Orders (assigned, available, completed)

### API Client Setup (React)

**Axios Configuration**:
```typescript
// Base URL
const API_BASE_URL = 'http://your-backend-url:8080';

// Request Interceptor: Add token
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle token refresh
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Refresh token logic
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post('/api/auth/refresh', { refreshToken });
          localStorage.setItem('auth_token', response.data.token);
          localStorage.setItem('refresh_token', response.data.refreshToken);
          // Retry original request
          return axios.request(error.config);
        } catch (refreshError) {
          // Logout
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
```

---

## Implementation Checklist

### Phase 1: Authentication
- [ ] Sign Up screen with validation
- [ ] Login screen
- [ ] Password reset flow (Forgot → OTP → Reset)
- [ ] Token refresh interceptor
- [ ] Session management (localStorage)
- [ ] Protected routes based on role

### Phase 2: Customer Features
- [ ] Home screen (menu items, categories)
- [ ] Product detail screen
- [ ] Cart management
- [ ] Checkout flow (address, payment)
- [ ] Razorpay integration
- [ ] Orders list and details
- [ ] Customer profile

### Phase 3: Provider Features
- [ ] Provider onboarding (blocked until complete)
- [ ] Provider dashboard
- [ ] Product management (CRUD)
- [ ] Orders management
- [ ] Delivery partner management
- [ ] Provider profile

### Phase 4: Delivery Partner Features
- [ ] Delivery partner dashboard (tabs)
- [ ] Order management (accept, pickup, deliver)
- [ ] OTP verification
- [ ] Delivery partner profile

### Phase 5: Common Features
- [ ] Image upload/display
- [ ] Search and filter
- [ ] Pagination
- [ ] Swipe to refresh
- [ ] Error handling
- [ ] Loading states
- [ ] Empty states

---

## Notes for React Implementation

1. **Routing**: Use React Router with protected routes
2. **State Management**: Use Context API or Redux/Zustand
3. **Forms**: Use React Hook Form or Formik
4. **HTTP Client**: Use Axios with interceptors
5. **Image Handling**: Use base64 decoding for display, FormData for upload
6. **Payment**: Use Razorpay React SDK or web integration
7. **Responsive Design**: Mobile-first approach (Android app is mobile)
8. **UI Library**: Consider Material-UI, Ant Design, or Tailwind CSS
9. **Type Safety**: Use TypeScript interfaces matching the DTOs
10. **Error Boundaries**: Implement error boundaries for better UX

---

**End of Documentation**

