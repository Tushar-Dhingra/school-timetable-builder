# 🚀 Deployment Guide

## Prerequisites
- GitHub account
- MongoDB Atlas account
- Vercel account
- Render account

## Step 1: MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "FREE" shared cluster
   - Select cloud provider and region
   - Create cluster (takes 1-3 minutes)

3. **Setup Database Access**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set role to "Atlas Admin"

4. **Setup Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

5. **Get Connection String**
   - Go to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

## Step 2: Backend Deployment (Render)

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Render**
   - Go to [Render](https://render.com)
   - Sign up/Login with GitHub
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository: `school-timetable-builder`
   - Configure:
     - **Name**: `timetable-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`

3. **Add Environment Variables**
   - In Render dashboard, go to your service
   - Click "Environment" tab
   - Add environment variable:
     - **Key**: `MONGODB_URI`
     - **Value**: Your MongoDB Atlas connection string

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy the service URL (e.g., `https://timetable-backend-xxxx.onrender.com`)

## Step 3: Frontend Deployment (Vercel)

1. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Next.js
     - **Root Directory**: `frontend`

2. **Add Environment Variables**
   - In project settings, go to "Environment Variables"
   - Add:
     - **Key**: `NEXT_PUBLIC_API_URL`
     - **Value**: `https://your-render-backend-url.onrender.com/api`
     - **Environment**: All (Production, Preview, Development)

3. **Deploy**
   - Click "Deploy"
   - Wait for deployment (2-5 minutes)
   - Your app will be live at `https://your-project-name.vercel.app`

## Step 4: Update CORS Settings

1. **Update Backend CORS**
   - In your code, update `backend/src/index.ts`
   - Replace `your-frontend-domain.vercel.app` with your actual Vercel domain
   - Commit and push changes
   - Render will auto-deploy

## Step 5: Test Your Deployment

1. Visit your Vercel frontend URL
2. Try creating a timetable entry
3. Verify data persists in MongoDB Atlas

## 🔧 Troubleshooting

### Backend Issues
- Check Render logs in dashboard
- Verify MongoDB connection string
- Ensure environment variables are set

### Frontend Issues
- Check Vercel function logs
- Verify API URL environment variable
- Check browser network tab for API calls

### Database Issues
- Verify MongoDB Atlas network access
- Check database user permissions
- Confirm connection string format

## 📱 Quick Commands

**Local Development:**
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend  
cd frontend
npm install
npm run dev
```

**Production URLs:**
- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-backend.onrender.com`
- Database: MongoDB Atlas cluster

## 🎉 Success!

Your School Timetable Builder is now live and accessible worldwide!