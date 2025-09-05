# Fix for Vercel 404 Error on Filtered URLs

## Problem
When accessing URLs like `https://www.sharktankinsider.shop/products?category=Health%20%26%20Wellness` on Vercel, you get a 404 error because Vercel doesn't know how to handle client-side routes.

## Solution
I've added the necessary configuration files to fix this:

### Files Added:
1. **`vercel.json`** - Main Vercel configuration
2. **`public/_redirects`** - Backup redirect configuration

## What These Files Do:

### `vercel.json`:
- **Rewrites**: Tells Vercel to serve `index.html` for all routes
- **Headers**: Adds security headers
- **Result**: All URLs (including filtered ones) will work properly

### `public/_redirects`:
- **Backup**: Alternative redirect method
- **Pattern**: `/*    /index.html   200`
- **Result**: Ensures all routes return the main app

## How to Deploy the Fix:

### Option 1: Git Push (Recommended)
1. **Commit the new files**:
   ```bash
   git add vercel.json public/_redirects
   git commit -m "Fix Vercel 404 error for client-side routes"
   git push
   ```

2. **Vercel will auto-deploy** the changes

### Option 2: Manual Deploy
1. **Go to Vercel Dashboard**
2. **Click "Redeploy"** on your project
3. **Or trigger a new deployment**

## After Deployment:
✅ **These URLs will work**:
- `https://www.sharktankinsider.shop/products`
- `https://www.sharktankinsider.shop/products?category=Health%20%26%20Wellness`
- `https://www.sharktankinsider.shop/products?search=tea`
- `https://www.sharktankinsider.shop/admin`
- Any other client-side route

## Test the Fix:
1. **Deploy the changes**
2. **Visit**: `https://www.sharktankinsider.shop/products?category=Health%20%26%20Wellness`
3. **Should work** without 404 error

## Why This Happened:
- **Local Development**: Vite dev server handles all routes automatically
- **Production**: Vercel needs explicit configuration to handle SPA routes
- **Solution**: Tell Vercel to serve `index.html` for all routes, letting React Router handle the routing

The fix is now ready to deploy! 🚀
