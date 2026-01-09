# DEPLOYMENT GUIDE

## ✅ What Was Fixed

### Backend (Render)
1. ✓ Updated `server.js` to bind to `0.0.0.0` instead of localhost
2. ✓ Added `HOST` environment variable support
3. ✓ Changed start script from `nodemon server.js` → `node server.js` (production ready)
4. ✓ Added `dev` script for local development with nodemon
5. ✓ Added Node.js engine specification (>=18.0.0)
6. ✓ Created `render.yaml` for deployment configuration
7. ✓ Created `.env.example` with all required variables

### Frontend (Vercel)
1. ✓ Fixed `vercel.json` - removed invalid `@` syntax
2. ✓ Removed `--legacy-peer-deps` flag (unnecessary)
3. ✓ Created `.env` for local development
4. ✓ Created `.env.production` for production use

---

## 📋 Deployment Steps

### Step 1: Deploy Backend to Render

1. Go to https://render.com
2. Create a new **Web Service**
3. Connect your GitHub repository
4. Select the `backend` folder as root
5. Set the environment variables in Render dashboard:
   ```
   MONGO_URI = mongodb+srv://todoUser:dwDKaMFGBP8RFWKJ@cluster0.ituococ.mongodb.net/?appName=Cluster0
   JWT_SECRET = your-super-secret-key-change-this-in-production-12345
   PORT = 5000
   HOST = 0.0.0.0
   ```
6. Click Deploy
7. **Copy your backend URL** (e.g., https://your-backend-app.onrender.com)

### Step 2: Configure Frontend for Vercel

1. Update `frontend/.env.production` with your Render backend URL:
   ```
   VITE_API_URL=https://your-backend-app.onrender.com/api
   ```

2. Commit and push to GitHub

### Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Import your GitHub project
3. Select `frontend` folder as root
4. Add environment variable:
   ```
   VITE_API_URL = https://your-backend-app.onrender.com/api
   ```
5. Click Deploy

---

## 🧪 Testing Locally

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173 (frontend will connect to http://localhost:5000/api)

---

## 🔒 Security Notes

- Change `JWT_SECRET` in production
- Never commit `.env` files with real credentials
- Keep `.env.example` updated for team reference

