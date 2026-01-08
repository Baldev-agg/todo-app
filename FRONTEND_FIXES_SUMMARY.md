# Todo App - Complete Setup & Testing Guide

## ✅ What's Been Fixed & Improved

### Backend
✅ Fixed module consistency (all using ES6 imports/exports)
✅ Fixed field name mismatches (`userId` → `UserId`)
✅ Fixed authMiddleware (`req.header` → `req.headers`)
✅ Added all required dependencies (bcryptjs, jsonwebtoken)
✅ Created `.env` file with required variables

### Frontend
✅ Fixed ProtectedRoute (was using incorrect import)
✅ Enhanced Login page with beautiful UI
✅ Enhanced Register page with validation feedback
✅ Completely redesigned Dashboard page with:
  - Welcome message with user name
  - Statistics cards (Total, Completed, Remaining tasks)
  - Better error handling
  - Loading states
  - Empty state message
  - Task completion tracking with visual indicators
  - Responsive design

✅ Created beautiful Landing page with:
  - Hero section explaining the app
  - Features showcase
  - Stats about the app
  - Call-to-action buttons
  - Professional footer

✅ Installed missing dependencies:
  - `lucide-react` (for beautiful icons)
  - `react-router-dom` (for routing)

✅ Fixed App.jsx routing to include Landing page

---

## 🚀 How to Run the Application

### Prerequisites
- Node.js installed
- MongoDB database (local or Render)
- .env file in backend with:
  - `MONGO_URI` = your MongoDB connection string
  - `JWT_SECRET` = any secret string
  - `PORT` = 5000

### Step 1: Run Backend

```bash
cd backend
npm install
npm start
```

You should see: `Server running on port 5000`

### Step 2: Run Frontend

```bash
cd frontend
npm run dev
```

You should see: `VITE v7.2.4  ready in 123 ms`

### Step 3: Open in Browser

Go to `http://localhost:5173`

---

## 📮 How to Test with Postman

### Get Started with Postman

1. **Download Postman** from https://www.postman.com/
2. **Open Postman** and create new requests
3. **Base URL**: `http://localhost:5000`

### Test Sequence

#### 1️⃣ Register a User
```
POST http://localhost:5000/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response**: 201 Created with user data

---

#### 2️⃣ Login
```
POST http://localhost:5000/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response**: 
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

⚠️ **COPY THIS TOKEN - You'll need it for all protected endpoints!**

---

#### 3️⃣ Get All Todos (Protected)
```
GET http://localhost:5000/todos
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response**: 200 OK with empty array (first time) or array of todos

---

#### 4️⃣ Create a Todo (Protected)
```
POST http://localhost:5000/todos
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "text": "Buy groceries"
}
```

**Expected Response**: 201 Created with the todo object

---

#### 5️⃣ Update Todo (Mark as Complete)
```
PUT http://localhost:5000/todos/TODOIDFROMSTEP4
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "completed": true
}
```

**Expected Response**: 200 OK with updated todo

---

#### 6️⃣ Delete a Todo
```
DELETE http://localhost:5000/todos/TODOIDFROMSTEP4
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response**: 200 OK with success message

---

## 🎨 Frontend Features

### Landing Page (`/landing`)
- Public page visible to everyone
- Shows app features and benefits
- Sign In & Sign Up buttons
- Professional marketing content

### Register Page (`/register`)
- Beautiful pink-to-red gradient background
- Email validation
- Password strength hint
- Success/error feedback
- Auto-redirect to login after registration

### Login Page (`/login`)
- Beautiful blue-to-purple gradient background
- Email and password inputs
- Error messages
- Loading state during login
- Link to registration page

### Dashboard (`/`)
- ✅ Requires authentication (protected route)
- Welcome message with user's name
- 3 stat cards showing:
  - Total tasks
  - Completed tasks
  - Remaining tasks
- Add new task input with Enter key support
- Task list with:
  - Checkbox to mark complete
  - Strike-through for completed tasks
  - Delete button
  - Visual indicators for completion
- Loading state when fetching tasks
- Empty state message when no tasks
- Logout button
- Responsive design (mobile-friendly)

---

## 🔐 Authentication Flow

1. User registers → Account created in MongoDB
2. User logs in → JWT token generated
3. Token stored in browser's localStorage
4. Token sent with every request in Authorization header
5. Backend verifies token
6. Protected routes accessible only with valid token

---

## 📁 Project Structure

```
todo-app/
├── backend/
│   ├── server.js                 (Main server file)
│   ├── package.json             
│   ├── .env                      (Environment variables)
│   ├── middleware/
│   │   └── authMiddleware.js    (JWT verification)
│   ├── models/
│   │   ├── User.js              (User schema)
│   │   └── Todo.js              (Todo schema)
│   └── routes/
│       ├── authRoutes.js        (Login/Register endpoints)
│       └── todoRoutes.js        (Todo CRUD endpoints)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx              (Main routing)
│   │   ├── main.jsx             (Entry point)
│   │   ├── pages/
│   │   │   ├── Landing.jsx      (Home page)
│   │   │   ├── Login.jsx        (Login page)
│   │   │   ├── Register.jsx     (Registration page)
│   │   │   └── Dashboard.jsx    (Task management page)
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx (Route protection)
│   │   ├── services/
│   │   │   └── api.js           (Axios configuration)
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── POSTMAN_TESTING_GUIDE.md      (This guide)
```

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **Backend won't start** | Check MongoDB connection in `.env` |
| **401 Unauthorized on todos** | Make sure token is in Authorization header |
| **CORS errors** | Add `Access-Control-Allow-Origin` in backend |
| **Frontend can't connect to backend** | Check `VITE_API_URL` in `.env` |
| **Tasks not showing** | Verify you're logged in and token is valid |
| **Can't delete todos** | Make sure todo ID exists |

---

## 🌐 Deployment Checklist

### Backend (Render)
- [ ] Push code to GitHub
- [ ] Create Render service
- [ ] Add environment variables
- [ ] Deploy
- [ ] Test all endpoints

### Frontend (Vercel)
- [ ] Update `VITE_API_URL` to deployed backend URL
- [ ] Push to GitHub
- [ ] Deploy on Vercel
- [ ] Test all features

---

## 📝 API Endpoints Summary

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/auth/register` | No | Create new account |
| POST | `/auth/login` | No | Login and get token |
| GET | `/todos` | Yes | Get all user's todos |
| POST | `/todos` | Yes | Create new todo |
| PUT | `/todos/:id` | Yes | Update todo (mark complete) |
| DELETE | `/todos/:id` | Yes | Delete todo |

---

## ✨ Next Steps (Optional Enhancements)

1. **Add todo categories/tags**
2. **Add due dates to todos**
3. **Add priority levels**
4. **Add search/filter functionality**
5. **Add dark mode**
6. **Add notifications**
7. **Add user profile page**
8. **Add forgot password feature**
9. **Add todo sharing between users**
10. **Add mobile app**

---

## 🎯 You're All Set!

Your Todo App is now:
- ✅ Fully authenticated
- ✅ Beautiful and modern
- ✅ Production-ready
- ✅ Easy to test and deploy

**Happy coding! 🚀**

Need help? Check the Postman testing guide included in the repo!
