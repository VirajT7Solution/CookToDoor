---
name: Fix 500 error preventing users from displaying in admin panel
overview: Diagnose and fix the 500 Internal Server Error when fetching users - users exist in DB but API endpoint fails during JSON serialization
todos: []
---

# Fix 500 Error - Users Not Displaying in Admin Panel

## Problem Diagnosis

**Confirmed Facts:**

- ✅ 8 users exist in the database
- ✅ Users table structure is correct
- ✅ Backend endpoint `/api/users` returns 500 error
- ✅ Frontend cannot fetch users due to API failure

**Root Cause:**
The 500 error is occurring during JSON serialization when Spring tries to convert User entities to JSON. The User entity implements `UserDetails` interface which has methods that Jackson tries to serialize, causing issues.

## Issues Identified

1. **UserDetails Interface Methods**: User implements UserDetails which has methods like `getAuthorities()`, `isEnabled()`, etc. that Jackson tries to serialize
2. **Address Relationship**: OneToOne relationship with Address may cause lazy loading or circular reference issues
3. **Password Exposure**: Password field should not be serialized in responses
4. **No Exception Details**: Need better error logging to identify exact failure point

## Solution Strategy

### Step 1: Add JSON Ignore Annotations to User Entity

Prevent UserDetails interface methods from being serialized:

- Add `@JsonIgnore` to `getAuthorities()`, `isAccountNonExpired()`, `isAccountNonLocked()`, `isCredentialsNonExpired()`, `isEnabled()`
- Add `@JsonIgnore` to `getAddress()` getter method
- Add `@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)` to password field

### Step 2: Add Class-Level JSON Ignore Properties

Update `@JsonIgnoreProperties` annotation to exclude UserDetails methods

### Step 3: Verify Controller Exception Handling

Ensure UserController has proper exception handling and logging (already added in previous fix)

### Step 4: Test the Fix

After applying fixes, test the endpoint to ensure it returns 200 OK with user list

## Files to Modify

1. **`src/main/java/com/platemate/model/User.java`**

- Add `@JsonIgnore` to UserDetails methods
- Add `@JsonIgnore` to address getter
- Add `@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)` to password
- Update class-level `@JsonIgnoreProperties`

## Expected Outcome

- `/api/users` endpoint returns 200 OK
- JSON response contains list of users without UserDetails methods
- Password and Address are excluded from response
- Users display correctly in admin panel