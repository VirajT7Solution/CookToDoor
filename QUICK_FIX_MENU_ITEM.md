# Quick Fix: Create Menu Item Error

## Problem
Getting 500 Internal Server Error when creating menu item:
```
POST /api/providers/menu-items
Content-Type: application/json
```

## Solution: Use Multipart Form Data

The endpoint expects `multipart/form-data`, not JSON!

---

## Postman Setup

### Step 1: Set Request Type
1. Select **POST** method
2. URL: `http://localhost:9090/api/providers/menu-items`
3. Go to **Body** tab
4. Select **form-data** (NOT raw or JSON)

### Step 2: Add Data Field
1. In form-data, add a new key: `data`
2. Change type from "Text" to **Text** (keep it as Text)
3. In the value field, paste this JSON:
```json
{
  "itemName": "Dal Makhani",
  "description": "Creamy black lentils cooked with butter and cream",
  "price": 150.00,
  "ingredients": "Black lentils, kidney beans, cream, butter, spices",
  "mealType": "LUNCH",
  "categoryId": 1,
  "isAvailable": true
}
```

### Step 3: Add Image (Optional)
1. Add another key: `image`
2. Change type to **File**
3. Click "Select Files" and choose an image (JPG/PNG)

### Step 4: Set Authorization
1. Go to **Authorization** tab
2. Type: **Bearer Token**
3. Token: `{your_provider_token}`

---

## Visual Guide

**Body Tab:**
```
Key          | Type | Value
-------------|------|----------------------------------------
data         | Text | {"itemName":"Dal Makhani",...}
image        | File | [Select image file - optional]
```

**Authorization Tab:**
```
Type: Bearer Token
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Complete Postman Request

### Method & URL
```
POST http://localhost:9090/api/providers/menu-items
```

### Headers (Auto-set by Postman)
```
Authorization: Bearer {your_provider_token}
Content-Type: multipart/form-data (automatic)
```

### Body (form-data)
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

image: [Select file - optional]
```

---

## Expected Response

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

---

## Common Mistakes

### ❌ Wrong: Sending as JSON
```
Body: raw → JSON
Content-Type: application/json
{
  "itemName": "Dal Makhani",
  ...
}
```

### ✅ Correct: Sending as Form Data
```
Body: form-data
Key: data (Text) → JSON string
Key: image (File) → Image file
```

---

## Alternative: Using cURL

```bash
curl -X POST http://localhost:9090/api/providers/menu-items \
  -H "Authorization: Bearer {your_token}" \
  -F "data={\"itemName\":\"Dal Makhani\",\"description\":\"Creamy black lentils\",\"price\":150.00,\"ingredients\":\"Black lentils, cream\",\"mealType\":\"LUNCH\",\"categoryId\":1,\"isAvailable\":true}" \
  -F "image=@/path/to/image.jpg"
```

---

## Troubleshooting

### Error: "Provider is not approved yet"
**Solution:** Admin must approve provider first

### Error: "Category not found"
**Solution:** Ensure category with ID 1 exists

### Error: "Full authentication is required"
**Solution:** Check your provider token is valid

### Error: Still getting 500 error
**Solution:** 
1. Check backend console for detailed error
2. Verify provider is logged in
3. Verify provider profile exists
4. Verify category exists

---

## Quick Checklist

- [ ] Using POST method
- [ ] URL: `/api/providers/menu-items`
- [ ] Body type: **form-data** (NOT raw JSON)
- [ ] Key name: `data` (exact spelling)
- [ ] Data value: Valid JSON string
- [ ] Authorization: Bearer token set
- [ ] Provider is approved (`isVerified = true`)
- [ ] Category ID exists

---

**That's it!** Use form-data instead of raw JSON and your request will work.




