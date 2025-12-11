# Postman Guide: Creating Menu Items

This guide will help you create menu items via Postman API calls.

## Prerequisites

1. **Authentication**: You need to be logged in as a **PROVIDER** user
2. **Category ID**: You need to have at least one category created (get category ID from categories list)
3. **Provider Profile**: Your provider profile must be verified/approved

---

## Step 1: Get Your Authentication Token

### Endpoint: `POST /api/auth/login`

**Request:**
```json
{
  "username": "your_provider_username",
  "password": "your_password"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "PROVIDER",
  "userId": 123
}
```

**Copy the `token` value** - you'll need it for the Authorization header.

---

## Step 2: Get Available Categories

### Endpoint: `GET /api/categories`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response Example:**
```json
[
  {
    "id": 1,
    "categoryName": "Kathiyawadi",
    "description": "Authentic Kathiyawadi Bhanu",
    "imageBase64": "...",
    "imageFileType": "image/png"
  },
  {
    "id": 2,
    "categoryName": "Gujarati",
    "description": "Traditional Gujarati Food",
    "imageBase64": "...",
    "imageFileType": "image/png"
  }
]
```

**Note the `id` of the category** you want to use for your menu item.

---

## Step 3: Create Menu Item

### Endpoint: `POST /api/providers/menu-items`

**Method:** `POST`  
**URL:** `http://localhost:8080/api/providers/menu-items`  
**Content-Type:** `multipart/form-data` (Postman will set this automatically)

### Headers:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Body (form-data):

In Postman, select **Body** → **form-data**, then add these fields:

| Key | Type | Value |
|-----|------|-------|
| `data` | Text | See JSON below |
| `image` | File | (Optional) Select an image file |

### JSON for `data` field:

```json
{
  "categoryId": 1,
  "itemName": "Dal Dhokli",
  "description": "Traditional Gujarati dal dhokli with ghee and spices",
  "price": 120.50,
  "ingredients": "Wheat flour, dal, ghee, turmeric, red chili, cumin, coriander",
  "mealType": "VEG",
  "isAvailable": true
}
```

### Field Descriptions:

| Field | Type | Required | Description | Example Values |
|-------|------|-----------|-------------|----------------|
| `categoryId` | Long | ✅ Yes | ID of the category (from Step 2) | `1`, `2`, `3` |
| `itemName` | String | ✅ Yes | Name of the menu item | `"Dal Dhokli"`, `"Butter Chicken"` |
| `description` | String | ✅ Yes | Description of the item | `"Traditional Gujarati dal dhokli..."` |
| `price` | Double | ✅ Yes | Price of the item | `120.50`, `250.00` |
| `ingredients` | String | ✅ Yes | List of ingredients | `"Wheat flour, dal, ghee..."` |
| `mealType` | String | ✅ Yes | Type of meal (enum) | `"VEG"`, `"NON_VEG"`, `"JAIN"` |
| `isAvailable` | Boolean | ❌ No | Availability status (default: `true`) | `true`, `false` |

### MealType Enum Values:
- `VEG` - Vegetarian
- `NON_VEG` - Non-vegetarian
- `JAIN` - Jain (vegetarian without root vegetables)

### Image (Optional):
- **Key:** `image`
- **Type:** File
- **Supported formats:** JPG, PNG, etc.
- **Max size:** 10MB (as per application.properties)

---

## Example Requests

### Example 1: Create Vegetarian Menu Item with Image

**Body (form-data):**

| Key | Type | Value |
|-----|------|-------|
| `data` | Text | `{"categoryId":1,"itemName":"Dal Dhokli","description":"Traditional Gujarati dal dhokli with ghee and spices","price":120.50,"ingredients":"Wheat flour, dal, ghee, turmeric, red chili, cumin, coriander","mealType":"VEG","isAvailable":true}` |
| `image` | File | `dal_dhokli.jpg` |

### Example 2: Create Non-Vegetarian Menu Item without Image

**Body (form-data):**

| Key | Type | Value |
|-----|------|-------|
| `data` | Text | `{"categoryId":1,"itemName":"Butter Chicken","description":"Creamy butter chicken with aromatic spices","price":250.00,"ingredients":"Chicken, butter, cream, tomatoes, onions, garlic, ginger, garam masala","mealType":"NON_VEG","isAvailable":true}` |

### Example 3: Create Jain Menu Item

**Body (form-data):**

| Key | Type | Value |
|-----|------|-------|
| `data` | Text | `{"categoryId":2,"itemName":"Jain Thali","description":"Complete Jain meal without root vegetables","price":180.00,"ingredients":"Roti, dal, sabzi (no onion/garlic), rice, papad, pickle","mealType":"JAIN","isAvailable":true}` |

---

## Expected Response

**Success Response (200 OK):**
```json
{
  "id": 15,
  "categoryId": 1,
  "itemName": "Dal Dhokli",
  "description": "Traditional Gujarati dal dhokli with ghee and spices",
  "price": 120.50,
  "ingredients": "Wheat flour, dal, ghee, turmeric, red chili, cumin, coriander",
  "mealType": "VEG",
  "isAvailable": true,
  "imageBase64List": [
    "iVBORw0KGgoAAAANSUhEUgAA..."
  ],
  "imageFileTypeList": [
    "image/jpeg"
  ]
}
```

**Error Responses:**

1. **401 Unauthorized** - Invalid or missing token
   ```json
   {
     "error": "Unauthorized"
   }
   ```

2. **403 Forbidden** - Provider not verified/approved
   ```json
   {
     "error": "Provider is not approved yet"
   }
   ```

3. **404 Not Found** - Category not found
   ```json
   {
     "error": "Category not found"
   }
   ```

4. **400 Bad Request** - Missing required fields or invalid data
   ```json
   {
     "error": "Validation failed",
     "details": "..."
   }
   ```

---

## Postman Collection Setup

### Quick Setup Steps:

1. **Create a new request** in Postman
2. **Set method to:** `POST`
3. **Set URL to:** `http://localhost:8080/api/providers/menu-items`
4. **Go to Headers tab:**
   - Add: `Authorization` = `Bearer YOUR_TOKEN_HERE`
5. **Go to Body tab:**
   - Select `form-data`
   - Add `data` field (Type: Text) with JSON value
   - Add `image` field (Type: File) - select your image file (optional)
6. **Click Send**

### Screenshot Guide:

```
┌─────────────────────────────────────────┐
│ POST http://localhost:8080/api/...      │
├─────────────────────────────────────────┤
│ Params │ Authorization │ Headers │ Body │
├─────────────────────────────────────────┤
│ Body: ● form-data                        │
│                                           │
│ Key          │ Type │ Value              │
│ data         │ Text │ {JSON here}        │
│ image        │ File │ [Select File]      │
└─────────────────────────────────────────┘
```

---

## Additional Endpoints

### Get All My Menu Items
**GET** `/api/providers/menu-items`  
**Headers:** `Authorization: Bearer YOUR_TOKEN`

### Get Single Menu Item
**GET** `/api/providers/menu-items/{id}`  
**Headers:** `Authorization: Bearer YOUR_TOKEN`

### Update Menu Item
**PUT** `/api/providers/menu-items/{id}`  
**Body:** Same as create (form-data with `data` and optional `image`)

### Toggle Availability
**PATCH** `/api/providers/menu-items/{id}/availability`  
**Body (JSON):**
```json
{
  "available": true
}
```

### Delete Menu Item (Soft Delete)
**DELETE** `/api/providers/menu-items/{id}`

---

## Tips

1. **Always use the token** from login in the Authorization header
2. **Check category IDs** before creating menu items
3. **Image is optional** - you can add it later via the image upload endpoint
4. **MealType must be exact**: `VEG`, `NON_VEG`, or `JAIN` (case-sensitive)
5. **Price should be a number** (e.g., `120.50`, not `"120.50"` in JSON)
6. **Provider must be verified** - contact admin if you get "not approved" error

---

## Troubleshooting

### Issue: "Provider is not approved yet"
**Solution:** Your provider profile needs to be approved by an admin. Contact admin or check your provider status.

### Issue: "Category not found"
**Solution:** Make sure the `categoryId` exists. Use `GET /api/categories` to get valid category IDs.

### Issue: "Current request is not a multipart request"
**Solution:** Make sure you're using `form-data` in Postman Body, not `raw` or `x-www-form-urlencoded`.

### Issue: "Unauthorized"
**Solution:** Check that your token is valid and included in the Authorization header as `Bearer YOUR_TOKEN`.

---

## Sample Menu Items for Testing

Here are some sample menu items you can create:

### Sample 1: Vegetarian
```json
{
  "categoryId": 1,
  "itemName": "Gujarati Thali",
  "description": "Complete Gujarati meal with dal, sabzi, roti, rice, and sweet",
  "price": 150.00,
  "ingredients": "Dal, vegetables, wheat flour, rice, ghee, spices, jaggery",
  "mealType": "VEG",
  "isAvailable": true
}
```

### Sample 2: Non-Vegetarian
```json
{
  "categoryId": 1,
  "itemName": "Chicken Biryani",
  "description": "Aromatic basmati rice with tender chicken pieces",
  "price": 280.00,
  "ingredients": "Basmati rice, chicken, onions, tomatoes, yogurt, biryani masala, saffron",
  "mealType": "NON_VEG",
  "isAvailable": true
}
```

### Sample 3: Jain
```json
{
  "categoryId": 2,
  "itemName": "Jain Khichdi",
  "description": "Simple and nutritious khichdi without onion and garlic",
  "price": 100.00,
  "ingredients": "Rice, moong dal, ghee, turmeric, cumin, salt",
  "mealType": "JAIN",
  "isAvailable": true
}
```

---

Happy testing! 🍽️

