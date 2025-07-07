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
5. Choose the backend folder: `backend-parlour-api`
6. Set environment variables:
   ```
   PORT=3001
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_minimum_32_chars
   CORS_ORIGIN=*
   ```
7. Deploy and get your backend URL (e.g., `https://your-app.railway.app`)

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

## Monitoring and Maintenance

1. **Logs**: Check deployment platform logs for errors
2. **Database**: Monitor MongoDB Atlas metrics
3. **Updates**: Use GitHub Actions for automated deployments
4. **Backups**: Set up automated database backups

---

Need help? Check the deployment platform documentation or create an issue in your repository.
