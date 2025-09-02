# Vercel Deployment Guide for Union Registry

## Quick Deploy to Vercel

### 1. Prepare for Deployment

1. **Push your code to GitHub** (if not already done)
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "Import Project"
   - Select your repository

### 2. Environment Variables Setup

In Vercel dashboard, add these environment variables:

**Required:**
- `DATABASE_URL` - Your Neon database connection string
- `SESSION_SECRET` - Random secure string for sessions
- `NODE_ENV` - Set to "production"

**Optional:**
- `VITE_GOOGLE_MAPS_API_KEY` - For enhanced mapping features
- `ADMIN_PASSWORD_HASH` - Bcrypt hashed admin password

### 3. Vercel Configuration

The project includes `vercel.json` with optimized settings:
- Frontend builds as static site
- Backend runs as serverless functions
- Automatic routing between frontend and API

### 4. Deploy Commands

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy from command line
vercel --prod

# Or deploy via GitHub integration (recommended)
# Push to main branch → auto-deploys
```

### 5. Database Setup

After deployment:
1. Ensure your Neon database is accessible from Vercel
2. The schema will be automatically applied
3. Check logs for any database connection issues

### 6. Custom Domain (Optional)

In Vercel dashboard:
1. Go to your project
2. Settings → Domains
3. Add your custom domain
4. Follow DNS instructions

## Project Structure for Vercel

```
/
├── vercel.json           # Vercel configuration
├── frontend/             # React app (builds to static)
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── backend/              # Serverless functions
│   ├── api/              # Vercel API routes
│   ├── utils/
│   └── package.json
└── shared/               # Shared types/schemas
```

## Performance Optimizations

✅ **Frontend**: Static site generation with Vite
✅ **Backend**: Serverless functions for instant scaling  
✅ **Database**: Neon serverless PostgreSQL
✅ **Caching**: Optimized API responses
✅ **CDN**: Global edge distribution via Vercel

Your app will be available at: `https://your-project.vercel.app`