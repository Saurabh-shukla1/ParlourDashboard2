# Deployment Guide - Parlour Management System

This guide will help you deploy your Parlour Management System (Backend API + Frontend Dashboard) using free cloud services.

## Prerequisites

1. GitHub repository (already done ✅)
2. MongoDB Atlas account (free)
3. Vercel account (free)
4. Railway account (free) or Render account (free)

## Step 1: Setup MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user with read/write permissions
4. Whitelist IP addresses (0.0.0.0/0 for all IPs or specific deployment IPs)
5. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/parlour-db`)

## Step 2: Deploy Backend API

### Option A: Railway (Recommended)

1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect your services. If it detects multiple services:
   - Select the backend service
   - Or manually set Root Directory to: `backend-parlour-api`
6. **If Railway doesn't show folder options:**
   - After connecting the repo, go to Settings → General
   - Set "Root Directory" to: `backend-parlour-api`
   - Set "Build Command" to: `npm run build`
   - Set "Start Command" to: `npm start`
7. Set environment variables in Settings → Variables:
   ```
   PORT=3001
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_minimum_32_chars
   CORS_ORIGIN=*
   ```
8. Deploy and get your backend URL (e.g., `https://your-app.railway.app`)

### Option B: Render

1. Go to [Render](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Set:
   - Root Directory: `backend-parlour-api`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
6. Add environment variables (same as Railway)
7. Deploy and get your backend URL

### Option C: Deploy Both on Vercel (Simplest)

Vercel can deploy both your frontend and backend. This is the easiest option:

#### Backend on Vercel:
1. Go to [Vercel](https://vercel.com)
2. Click "New Project" → Import your GitHub repository
3. **Important**: Set Root Directory to `backend-parlour-api`
4. Vercel will auto-detect it as a Node.js project
5. Add environment variables:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_minimum_32_chars
   CORS_ORIGIN=*
   ```
6. Deploy and get your backend URL

#### Frontend on Vercel:
1. Create another Vercel project
2. Import the same GitHub repository
3. Set Root Directory to `frontend-parlour-dashboard`
4. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=your_backend_vercel_url
   NEXT_PUBLIC_SOCKET_URL=your_backend_vercel_url
   ```
5. Deploy and get your frontend URL

**Note**: Vercel's free tier has some limitations for backend APIs, but it's perfect for getting started.

## Step 3: Deploy Frontend Dashboard

### Using Vercel (Recommended for Next.js)

1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Set Root Directory to: `frontend-parlour-dashboard`
6. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=your_backend_url_from_step2
   NEXT_PUBLIC_SOCKET_URL=your_backend_url_from_step2
   ```
7. Deploy and get your frontend URL

## Step 4: Update CORS Settings

After getting your frontend URL, update your backend environment variables:

```
CORS_ORIGIN=your_frontend_vercel_url
```

Redeploy your backend with the updated CORS settings.

## Step 5: Test Your Deployment

1. Visit your frontend URL
2. Try logging in and using the features
3. Check if the backend API is responding
4. Verify database connections

## Environment Variables Summary

### Backend (.env)
```
PORT=3001
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/parlour-db
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
CORS_ORIGIN=https://your-frontend-app.vercel.app
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://your-backend-app.railway.app
NEXT_PUBLIC_SOCKET_URL=https://your-backend-app.railway.app
```

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure CORS_ORIGIN matches your frontend URL exactly
2. **Database Connection**: Verify MongoDB Atlas connection string and IP whitelist
3. **Environment Variables**: Ensure all required env vars are set in deployment platforms
4. **Build Errors**: Check that all dependencies are in package.json, not just devDependencies

### Useful Commands:

```bash
# Test backend locally
cd backend-parlour-api
npm install
npm run build
npm start

# Test frontend locally
cd frontend-parlour-dashboard
npm install
npm run build
npm start
```

## Alternative Deployment Options

### Docker Deployment (Advanced)

If you prefer Docker:

1. Use the provided Dockerfiles
2. Deploy to any cloud platform that supports containers
3. Consider using Docker Compose for local development

### Self-Hosted (VPS)

If you have a VPS:

1. Install Node.js, MongoDB, and PM2
2. Clone your repository
3. Set up environment variables
4. Use PM2 to manage processes
5. Set up Nginx as reverse proxy

## Alternative: Quick Deploy with Render (Easier Setup)

If Railway is giving you trouble, Render is often easier for monorepos:

1. Go to [Render](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. **Important Settings:**
   - **Name**: `parlour-backend-api`
   - **Root Directory**: `backend-parlour-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. **Environment Variables** (click "Advanced"):
   ```
   PORT=10000
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_minimum_32_chars
   CORS_ORIGIN=*
   ```
7. Click "Create Web Service"
8. Wait for deployment and get your URL

## Troubleshooting Railway Deployment

### If Railway doesn't detect your backend folder:

**Method 1: Manual Configuration**
1. Deploy the repo normally (it might fail initially)
2. Go to your project → Settings → General
3. Set "Root Directory": `backend-parlour-api`
4. Redeploy

**Method 2: Create a separate repository**
1. Create a new GitHub repository for just the backend
2. Copy the `backend-parlour-api` folder contents to the new repo
3. Deploy the new repository

**Method 3: Use Railway CLI**
```bash
npm install -g @railway/cli
railway login
cd backend-parlour-api
railway deploy
```

## Monitoring and Maintenance

1. **Logs**: Check deployment platform logs for errors
2. **Database**: Monitor MongoDB Atlas metrics
3. **Updates**: Use GitHub Actions for automated deployments
4. **Backups**: Set up automated database backups

---

Need help? Check the deployment platform documentation or create an issue in your repository.
