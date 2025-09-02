#!/bin/bash

echo "🚀 Building Union Registry for Vercel deployment..."

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Prepare backend
echo "⚡ Preparing backend serverless functions..."
cd backend
npm install
cd ..

echo "✅ Build complete! Ready for Vercel deployment."
echo ""
echo "Next steps:"
echo "1. Push to GitHub"
echo "2. Connect repository to Vercel"
echo "3. Set environment variables in Vercel dashboard"
echo "4. Deploy!"