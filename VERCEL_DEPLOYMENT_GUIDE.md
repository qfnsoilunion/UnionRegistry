# Vercel Deployment Guide for Union Registry

## Project Structure
Your project is now organized with:
- `client/` - Frontend React application
- `backend/` - Backend API endpoints (Vercel serverless functions)
- `shared/` - Shared TypeScript types
- `vercel.json` - Vercel configuration

## Step-by-Step Deployment Instructions

### 1. Prerequisites
- Vercel account (sign up at vercel.com)
- Git repository (GitHub, GitLab, or Bitbucket)

### 2. Prepare Your Project

#### Step 2.1: Build the Frontend Locally (Optional - to test)
```bash
cd client
npm install
npm run build
```
This creates `client/dist` folder with your frontend files.

### 3. Push to Git Repository
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 4. Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended for first-time setup)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from project root:
```bash
vercel
```

4. Follow the prompts:
   - Link to existing project? **No** (first time)
   - Project name: **union-registry** (or your choice)
   - Which scope? Select your account
   - Link to existing project? **No**
   - In which directory is your code located? **./** (press Enter)
   - Want to override settings? **No**

#### Option B: Using Vercel Dashboard (Web Interface)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your Git repository
4. Vercel will auto-detect the configuration from `vercel.json`
5. Click "Deploy"

### 5. Configure Environment Variables

**IMPORTANT**: You must set these environment variables in Vercel:

1. Go to your project in Vercel Dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add these variables:

```
DATABASE_URL=your_neon_database_url_here
SESSION_SECRET=generate_a_random_32_character_string
NODE_ENV=production
```

To get your DATABASE_URL:
- It's the same PostgreSQL connection string from your Replit environment
- Format: `postgresql://username:password@host/database?sslmode=require`

### 6. Redeploy After Adding Environment Variables
```bash
vercel --prod
```
Or click "Redeploy" in Vercel Dashboard

### 7. Your URLs
After deployment:
- Frontend: `https://your-project-name.vercel.app`
- API endpoints: `https://your-project-name.vercel.app/api/*`

## File Structure Explained

```
union-registry/
├── client/               # Frontend React app
│   ├── src/             # Source code
│   ├── dist/            # Built files (created after npm run build)
│   ├── package.json     # Frontend dependencies
│   └── vite.config.ts   # Build configuration
├── backend/             # Backend API
│   ├── api/            # Vercel serverless functions
│   │   ├── search/     # /api/search endpoint
│   │   ├── metrics/    # /api/metrics endpoints
│   │   ├── dealers/    # /api/dealers endpoints
│   │   ├── employees/  # /api/employees endpoints
│   │   └── clients/    # /api/clients endpoints
│   ├── storage.ts      # Database operations
│   ├── db.ts          # Database connection
│   └── package.json   # Backend dependencies
├── shared/            # Shared TypeScript types
└── vercel.json       # Vercel configuration

```

## Important Notes

1. **Database**: Your Neon PostgreSQL database URL must be added to environment variables
2. **Build**: Vercel automatically builds your frontend using the command in `vercel.json`
3. **API Routes**: All `/api/*` requests are routed to `backend/api/*` serverless functions
4. **Static Files**: Frontend is served from `client/dist` after build

## Troubleshooting

### If deployment fails:
1. Check Vercel build logs for errors
2. Ensure all environment variables are set
3. Verify database connection string is correct
4. Check that all dependencies are in package.json files

### If API calls fail:
1. Check browser console for errors
2. Verify environment variables in Vercel dashboard
3. Check function logs in Vercel dashboard

### If styles don't load:
- The client build is already configured with `base: "./"` for proper asset loading

## Updates and Redeployment

To update your application:
1. Make changes locally
2. Test the build: `cd client && npm run build`
3. Commit and push to Git
4. Vercel automatically redeploys on push to main branch

Or manually redeploy:
```bash
vercel --prod
```

## Support
- Vercel Documentation: https://vercel.com/docs
- Check function logs: Vercel Dashboard → Functions tab
- Build logs: Vercel Dashboard → Deployments → View build logs