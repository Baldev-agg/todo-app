# 🎯 Quick Start - Step by Step

## Phase 1: Backend Testing (Postman)

### Step 1: Start Backend Server
```bash
cd backend
npm start
```
✅ You should see: "Server running on port 5000"

---

### Step 2: Test Registration in Postman

**Open Postman → New Request**

- **Method**: POST
- **URL**: `http://localhost:5000/auth/register`
- **Body (raw, JSON)**:
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test@123"
}
```

**Click Send** → You should get `200 OK` with user data

---

### Step 3: Test Login in Postman

**New Request**

- **Method**: POST
- **URL**: `http://localhost:5000/auth/login`
- **Body (raw, JSON)**:
```json
{
  "email": "test@example.com",
  "password": "Test@123"
}
```

**Click Send** → You should get a token response:
```json
{
  "token": "eyJhbGc..."
}
```

🔑 **Copy this token! You need it for the next steps.**

---

### Step 4: Test Creating a Todo

**New Request**

- **Method**: POST
- **URL**: `http://localhost:5000/todos`
- **Headers** Tab:
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  Content-Type: application/json
  ```
- **Body (raw, JSON)**:
```json
{
  "text": "Learn Node.js"
}
```

**Click Send** → You should get `201 Created` with the todo

---

### Step 5: Test Getting All Todos

**New Request**

- **Method**: GET
- **URL**: `http://localhost:5000/todos`
- **Headers** Tab:
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```

**Click Send** → You should see your todo in the response

---

### Step 6: Test Updating a Todo

Get the todo ID from the previous response.

**New Request**

- **Method**: PUT
- **URL**: `http://localhost:5000/todos/PASTE_TODO_ID_HERE`
- **Headers** Tab:
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  Content-Type: application/json
  ```
- **Body (raw, JSON)**:
```json
{
  "completed": true
}
```

**Click Send** → Todo should be marked complete

---

### Step 7: Test Deleting a Todo

**New Request**

- **Method**: DELETE
- **URL**: `http://localhost:5000/todos/PASTE_TODO_ID_HERE`
- **Headers** Tab:
  ```
  Authorization: Bearer YOUR_TOKEN_HERE
  ```

**Click Send** → Should get `200 OK` with success message

---

## Phase 2: Frontend Testing (Browser)

### Step 1: Start Frontend Server

In a **new terminal**:
```bash
cd frontend
npm run dev
```

✅ You should see:
```
VITE v7.2.4 ready in 123 ms
Local: http://localhost:5173
```

---

### Step 2: Open in Browser

Go to `http://localhost:5173`

You should see the **Landing Page** with:
- TaskMaster logo
- Features section
- Sign In / Sign Up buttons

---

### Step 3: Create Account

1. Click **"Sign Up"** button (top right)
2. Fill in:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `Test@123`
3. Click **"Sign Up"** button
4. Wait for success message
5. Auto-redirected to Login page

---

### Step 4: Login

1. Email: `test@example.com`
2. Password: `Test@123`
3. Click **"Sign In"**
4. Should be redirected to **Dashboard**

---

### Step 5: Create Todos in Frontend

1. On Dashboard, see input: "What needs to be done?"
2. Type: `Buy groceries`
3. Click **"Add"** button (or press Enter)
4. Todo appears in the list

---

### Step 6: Mark Todo Complete

1. Click the **circle checkbox** next to the todo
2. Todo should show:
   - Green checkmark
   - Strike-through text
   - Gray color

---

### Step 7: Delete Todo

1. Click the **trash icon** button on the right
2. Todo disappears from list

---

## Verification Checklist

### Backend Working?
- [ ] Server starts without errors
- [ ] Register endpoint works
- [ ] Login endpoint returns token
- [ ] Can create todos with token
- [ ] Can get all todos
- [ ] Can update/delete todos
- [ ] Tasks don't show across users

### Frontend Working?
- [ ] Landing page loads
- [ ] Can register new account
- [ ] Can login
- [ ] Can see Dashboard
- [ ] Can add todos
- [ ] Can mark complete
- [ ] Can delete todos
- [ ] Can logout
- [ ] UI is beautiful and responsive

---

## Troubleshooting

### Backend Issues
```
Error: connect ECONNREFUSED 127.0.0.1:27017
→ MongoDB not running. Start MongoDB service.

Error: Cannot find module 'bcryptjs'
→ Run: npm install

Error: Invalid token
→ Make sure token format is: Bearer YOUR_TOKEN
```

### Frontend Issues
```
Error: Cannot GET /
→ Make sure you're going to http://localhost:5173

Error: 401 Unauthorized
→ Token might be invalid or expired. Login again.

Error: Cannot connect to API
→ Check if backend is running on port 5000
→ Check VITE_API_URL in frontend config
```

---

## 🎉 Success!

If you can:
1. ✅ Create account in Postman
2. ✅ Login and get token in Postman
3. ✅ Create/read/update/delete todos in Postman
4. ✅ See Landing page in browser
5. ✅ Sign up and login in frontend
6. ✅ Create and manage todos in frontend

**Your Todo App is fully functional!**

---

## Next: Deployment

When ready to deploy:

### Backend on Render
```bash
1. Push code to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect GitHub repo
5. Add .env variables
6. Deploy!
```

### Frontend on Vercel
```bash
1. Update VITE_API_URL to deployed backend
2. Push code to GitHub
3. Go to https://vercel.com
4. Import project
5. Deploy!
```

---

**Questions? Check the FRONTEND_FIXES_SUMMARY.md file!**
