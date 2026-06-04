# Deployment Guide - Calorie Tracker

## 🚀 Quick Deployment to Vercel (5 minutes)

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub account
3. Authorize Vercel to access your GitHub repositories

### Step 2: Import Project to Vercel
1. On Vercel Dashboard, click "Add New..." → "Project"
2. Select GitHub repository: `calorie_tracker`
3. Click "Import"

### Step 3: Configure Environment Variables
1. In Import Project page, scroll to "Environment Variables"
2. Add the following variables:

```
DATABASE_URL = postgresql://user:password@host:5432/db_name
NEXTAUTH_SECRET = (generate with: openssl rand -base64 32)
NEXTAUTH_URL = https://your-app.vercel.app
```

**Get DATABASE_URL from Vercel Postgres**:
1. Go to Vercel Dashboard → Storage → Create Database
2. Select "Postgres"
3. Create new database
4. Copy connection string (with password)
5. Paste into DATABASE_URL env var

### Step 4: Deploy
1. Click "Deploy" button
2. Wait for build to complete (usually 2-3 minutes)
3. Once complete, you'll see "Congratulations! Your project is live"
4. Click the URL to visit your live app

### Step 5: Setup Vercel Postgres

1. Go to your Vercel project → "Storage" tab
2. Click "Create Database" → "Postgres"
3. Name it: `calorie_tracker`
4. Click "Create"
5. Copy the connection string and update `.env.local` locally
6. Run migrations:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

## Deployment Methods

### Option 1: Vercel (Recommended - Free Tier ✅)
- **Cost**: Free (500 Function Invocations/month, 100 GB bandwidth)
- **Setup Time**: 5 minutes
- **Database**: Vercel Postgres (3GB free)
- **Pros**: Zero-config for Next.js, built-in CI/CD, fast
- **Cons**: Limited to serverless functions, potential cold starts

**Steps**: Follow "Quick Deployment" above

### Option 2: Vercel (with GitHub Auto-Deploy)
1. Push all changes to GitHub
2. Create account on Vercel linked to GitHub
3. Import project
4. Every push to main branch auto-deploys

**Recommended**: This is the easiest workflow

### Option 3: Manual Deployment to Other Platforms

#### AWS Amplify
```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize
amplify init

# Deploy
amplify publish
```
Cost: Free tier (2GB storage, 5GB transfer)

#### Railway.app
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```
Cost: Free tier ($5/month credit)

#### Render.com
```bash
# Connect GitHub repository at render.com
# Select Node.js environment
# Add environment variables
# Deploy
```
Cost: Free tier (spinning down after 15 min of inactivity)

#### Google Cloud Run
```bash
# Install Google Cloud SDK
# Create Dockerfile (Next.js supports this)
# Deploy: gcloud run deploy
```
Cost: Free tier (2M requests/month)

## Environment Variables Setup

### Create .env.production for Production

```env
# Database (get from Vercel Postgres)
DATABASE_URL=postgresql://...

# Auth (generate: openssl rand -base64 32)
NEXTAUTH_SECRET=your-generated-secret

# Your deployed URL
NEXTAUTH_URL=https://your-app.vercel.app

# Optional: OAuth providers (for future)
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
```

**⚠️ NEVER commit .env files to Git**

## Database Setup on Vercel Postgres

### Access Vercel Postgres
1. Vercel Dashboard → Project → Storage tab
2. Click on your Postgres database
3. Click "Query" to run SQL commands
4. Or download a SQL client (pgAdmin, DBeaver)

### Run Migrations
```bash
# In your local dev environment
npm run db:migrate
npm run db:seed
```

## Troubleshooting

### Build Fails
- Check logs: Vercel Dashboard → Deployments → Failed build
- Common issues:
  - Missing environment variables
  - TypeScript errors
  - Missing dependencies
  - Port not available

### Database Connection Error
- Verify DATABASE_URL is correct
- Check database is running
- Ensure firewall allows connections
- For Vercel Postgres, may need to allowlist IP addresses

### Cold Starts / Slow Performance
- Vercel serverless functions can be slow initially
- Use caching strategies
- Consider upgrading Vercel plan
- Optimize database queries

### CORS Issues
- Ensure API routes return proper CORS headers
- Check NextAuth.js callback URLs

## Performance Optimization

### Before Deploying
```bash
# Check build size
npm run build

# Analyze bundle
npm install --save-dev @next/bundle-analyzer
# Add to next.config.js and run: npm run build
```

### After Deploying
1. Use Lighthouse in Chrome DevTools
2. Monitor Vercel Analytics (free)
3. Setup error tracking (Sentry.io - free tier)

## SSL/HTTPS

Vercel automatically provides SSL certificates. Your app will be accessible at:
```
https://your-app.vercel.app
```

## Custom Domain

1. Buy domain from GoDaddy, Namecheap, etc.
2. In Vercel Dashboard → Settings → Domains
3. Add custom domain
4. Point domain to Vercel nameservers
5. Wait 24-48 hours for DNS propagation

## Monitoring & Logging

### Vercel Built-in Monitoring
- Dashboard shows real-time logs
- Analytics show page performance
- Error tracking shows crashes

### External Services (Optional)
- **Error Tracking**: Sentry.io (free tier)
- **Analytics**: Vercel Analytics (free) or Mixpanel
- **Performance**: LogRocket (free trial)

## Auto-Deployment from GitHub

### Setup CI/CD with Vercel
1. Every push to `main` branch automatically deploys
2. Pull requests get preview deployments
3. Failed builds prevent deployment to production

### Workflow
```
Local Development
    ↓
git push origin feature-branch
    ↓
Create Pull Request on GitHub
    ↓
Vercel creates Preview Deployment
    ↓
Review & Test Preview
    ↓
Merge PR to main
    ↓
Vercel auto-deploys to Production
```

## Verify Deployment

Once deployed, verify:

1. **Landing Page**: https://your-app.vercel.app ✓
2. **Health Check**: https://your-app.vercel.app/api/health (create endpoint)
3. **Database Connection**: Try creating account (will work after db setup)

## Getting Your Live URL

After deployment, your app will be at:
```
https://calorie-tracker-[random].vercel.app
```

Or with custom domain:
```
https://yourdomain.com
```

## Next Steps After Deployment

1. **Setup Database**:
   ```bash
   # Run migrations on production database
   npm run db:migrate
   npm run db:seed
   ```

2. **Test Live App**:
   - Visit URL
   - Try landing page
   - Once auth implemented, test signup flow

3. **Monitor Performance**:
   - Check Vercel Dashboard
   - Monitor error rates
   - Watch database usage

4. **Continue Development**:
   - Implement remaining features (Phases 3-8)
   - Push to GitHub → auto-deploys
   - Test on live URL

## Cost Summary

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| Vercel Hosting | ✅ Unlimited deployments | $20/mo |
| Vercel Postgres | ✅ 3GB storage, 60 GB bandwidth | $15/mo |
| GitHub (private repo) | ✅ Unlimited | - |
| Total Monthly | **$0** | $35+ (optional) |

**Your app can run completely free on Vercel!**

---

## Quick Commands Summary

```bash
# Local development
npm run dev

# Build locally
npm run build
npm start

# Deploy to Vercel
vercel deploy --prod

# View logs
vercel logs

# List deployments
vercel ls
```

---

**Ready to go live?** Follow the Quick Deployment section above! 🚀
