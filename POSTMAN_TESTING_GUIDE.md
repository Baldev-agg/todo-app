# Postman Testing Guide

This guide will help you test your Todo App API using Postman.

## Getting Started

1. **Download Postman** from https://www.postman.com/downloads/ (if not already installed)
2. **Open Postman** and create a new workspace
3. Your API base URL should be: `http://localhost:5000` (or your deployed backend URL)

---

## Testing Auth Endpoints

### 1. Register User

- **Method:** `POST`
- **URL:** `http://localhost:5000/auth/register`
- **Headers:**
  - `Content-Type: application/json`

- **Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

- **Expected Response (201):**
```json
{
  "_id": "123abc...",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password"
}
```

---

### 2. Login User

- **Method:** `POST`
- **URL:** `http://localhost:5000/auth/login`
- **Headers:**
  - `Content-Type: application/json`

- **Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

- **Expected Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

⚠️ **Copy this token - you'll need it for the next requests!**

---

## Testing Todo Endpoints

### 3. Get All Todos (Protected)

- **Method:** `GET`
- **URL:** `http://localhost:5000/todos`
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN_HERE`

- **Expected Response (200):**
```json
[
  {
    "_id": "456def...",
    "UserId": "123abc...",
    "text": "Buy groceries",
    "completed": false,
    "createdAt": "2024-01-08T18:30:00Z"
  }
]
```

---

### 4. Create a Todo (Protected)

- **Method:** `POST`
- **URL:** `http://localhost:5000/todos`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_TOKEN_HERE`

- **Body (JSON):**
```json
{
  "text": "Complete project proposal"
}
```

- **Expected Response (201):**
```json
{
  "_id": "789ghi...",
  "UserId": "123abc...",
  "text": "Complete project proposal",
  "completed": false,
  "createdAt": "2024-01-08T18:35:00Z"
}
```

---

### 5. Update a Todo (Mark as Complete) (Protected)

- **Method:** `PUT`
- **URL:** `http://localhost:5000/todos/789ghi...`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer YOUR_TOKEN_HERE`

- **Body (JSON):**
```json
{
  "completed": true
}
```

- **Expected Response (200):**
```json
{
  "_id": "789ghi...",
  "UserId": "123abc...",
  "text": "Complete project proposal",
  "completed": true,
  "createdAt": "2024-01-08T18:35:00Z"
}
```

---

### 6. Delete a Todo (Protected)

- **Method:** `DELETE`
- **URL:** `http://localhost:5000/todos/789ghi...`
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN_HERE`

- **Expected Response (200):**
```json
{
  "message": "Todo deleted successfully"
}
```

---

## Quick Tips

1. **Store Token in Postman Variables:**
   - In Postman, go to the response of the Login endpoint
   - Click the token value in the response
   - Use it to set an environment variable
   - Then use `{{token}}` in your Authorization header

2. **Set Authorization for All Requests:**
   - In the collection, set a global Authorization header
   - Type: `Bearer`
   - Token: `{{token}}`

3. **Test Error Cases:**
   - Try logging in with wrong password
   - Try creating a todo without Authorization header
   - Try updating/deleting a todo that doesn't exist

---

## Common Issues

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Make sure your token is valid and correctly formatted in the Authorization header |
| 400 Bad Request | Check your request body JSON format |
| 404 Not Found | Verify the endpoint URL and that the resource exists |
| 500 Server Error | Check your backend server logs |

---

## Frontend Setup

Once backend is tested, run the frontend:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` (Vite default)

### Frontend Routes:
- `/landing` - Home/Landing page (public)
- `/register` - Sign up page
- `/login` - Sign in page
- `/` - Dashboard (protected, requires login)

---

## Quick Test Sequence

1. Register a new user
2. Login with that user (copy the token)
3. Create a new todo with the token
4. Get all todos (should see the one you created)
5. Update the todo to mark it complete
6. Delete the todo
7. Get todos again (should be empty)

That's it! Your API is working! 🎉
