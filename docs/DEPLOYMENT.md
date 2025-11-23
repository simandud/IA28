# CHRONOVAULT Deployment Guide

## Overview

This guide covers deploying CHRONOVAULT to production using Vercel (frontend) and Supabase (backend).

## Prerequisites

- Vercel account
- Supabase project
- Domain name (optional)
- GitHub account

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Vercel (Edge)                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Next.js Frontend + API Routes                          │   │
│  │  - Automatic SSL                                        │   │
│  │  - Global CDN                                           │   │
│  │  - Edge functions for performance                       │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    ↓                       ↓
        ┌─────────────────────┐   ┌─────────────────────┐
        │  Supabase (Backend) │   │  External Services  │
        ├─────────────────────┤   ├─────────────────────┤
        │ PostgreSQL Database │   │ Claude API          │
        │ Auth System         │   │ ElevenLabs          │
        │ Storage (S3)        │   │ D-ID                │
        │ pgvector (ML)       │   │ Stripe              │
        │ PostgREST API       │   │ Polygon RPC         │
        └─────────────────────┘   └─────────────────────┘
```

## Step 1: Supabase Setup

### 1.1 Create Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Configure:
   - Organization: Your org
   - Project name: chronovault-prod
   - Database password: Strong password
   - Region: Closest to your users
   - Pricing: Pro ($25/month minimum)

### 1.2 Run Migrations

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to project
supabase link --project-id YOUR_PROJECT_ID

# Push migrations
supabase db push

# Or manually run SQL in Supabase Dashboard:
# Copy and paste contents of supabase/migrations/001_initial_schema.sql
```

### 1.3 Enable Auth

In Supabase Dashboard:
1. Authentication → Providers
2. Enable Email (default)
3. Enable Google OAuth (optional)
4. Enable GitHub OAuth (optional)

Configure redirect URLs:
- `https://chronovault.app/auth/callback`
- `https://chronovault.app/`

### 1.4 Configure Storage

1. Storage → Create Bucket: `legacy-videos`
2. Storage → Create Bucket: `nft-images`
3. Make buckets private, use RLS for access

### 1.5 Setup RLS (Row Level Security)

```sql
-- legacy_videos: Users can only view their own
ALTER TABLE legacy_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own videos"
ON legacy_videos FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own videos"
ON legacy_videos FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Apply similar policies to other tables
```

## Step 2: Environment Variables

### 2.1 Get Supabase Keys

From Supabase Dashboard → Settings → API:
- URL: `NEXT_PUBLIC_SUPABASE_URL`
- Anon Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Service Role Key: `SUPABASE_SERVICE_ROLE_KEY`

### 2.2 External Service Keys

Get from respective providers:
- `ANTHROPIC_API_KEY`: Claude API
- `ELEVENLABS_API_KEY`: Voice synthesis
- `DEID_API_KEY`: Video synthesis
- `STRIPE_SECRET_KEY`: Payments
- `SENDGRID_API_KEY`: Email

### 2.3 Create `.env.production`

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
ANTHROPIC_API_KEY=sk-ant-...
ELEVENLABS_API_KEY=...
DEID_API_KEY=...
STRIPE_SECRET_KEY=sk_live_...
SENDGRID_API_KEY=SG....
NEXT_PUBLIC_APP_URL=https://chronovault.app
NODE_ENV=production
```

## Step 3: Vercel Deployment

### 3.1 Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import GitHub repository
4. Select `chronovault` repo

### 3.2 Configure Build Settings

- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### 3.3 Add Environment Variables

In Vercel project settings:
1. Environment Variables
2. Add all variables from `.env.production`
3. Select: Production, Preview, Development as needed

### 3.4 Deploy

1. Click "Deploy"
2. Wait for build to complete (~3 minutes)
3. Get URL: `https://chronovault.vercel.app`

### 3.5 Custom Domain (Optional)

1. Vercel Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records at registrar
4. Verify and wait for SSL (< 5 minutes)

## Step 4: Database Backups

### 4.1 Automated Backups

Supabase automatically backs up daily. To enable hourly:
1. Dashboard → Settings → Backups
2. Upgrade to Pro plan

### 4.2 Manual Backups

```bash
# Dump database
pg_dump postgresql://user:password@host:port/dbname > backup.sql

# Restore
psql postgresql://user:password@host:port/dbname < backup.sql
```

## Step 5: Monitoring & Logs

### 5.1 Vercel Analytics

- Vercel Dashboard → Monitoring
- View: Core Web Vitals, requests, errors

### 5.2 Supabase Logs

```bash
# View real-time logs
supabase functions logs

# View API usage
supabase stats --project-id YOUR_PROJECT_ID
```

### 5.3 Error Tracking

Setup Sentry:
```bash
npm install @sentry/nextjs
```

Configure in `next.config.js`:
```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
});
```

## Step 6: Performance Optimization

### 6.1 Image Optimization

Already handled by Next.js Image component. Ensure using:
```tsx
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={300}
  height={300}
  priority // For above-fold images
/>
```

### 6.2 Database Optimization

- Add indexes (already in migrations)
- Enable query caching in Supabase
- Use `@cached` for expensive queries

```typescript
// Tag for automatic caching
import { unstable_cache } from 'next/cache'

const getCachedData = unstable_cache(
  async () => {
    return await db.query()
  },
  ['cache-key'],
  { revalidate: 3600 } // 1 hour
)
```

### 6.3 API Rate Limiting

Implement in middleware:
```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit'
import { NextRequest } from 'next/server'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'),
})

export async function middleware(request: NextRequest) {
  const { success } = await ratelimit.limit(request.ip!)
  if (!success) return new Response('Too many requests', { status: 429 })
}
```

## Step 7: CI/CD Pipeline

### 7.1 Automatic Deploys

Vercel auto-deploys on push to main:
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

### 7.2 Testing Before Deploy

```bash
# Run tests
npm run test

# Build locally
npm run build

# Check for errors
npm run lint
```

## Step 8: Monitoring in Production

### 8.1 Key Metrics

```typescript
// Track in analytics
analytics.track('avatar_conversation', {
  duration: ms,
  tokens_used: count,
  user_id: userId,
})
```

### 8.2 Alerts

Setup alerts for:
- API latency > 2 seconds
- Error rate > 1%
- Database CPU > 80%
- Storage > 80% capacity

## Step 9: Scaling

### Phase 1: 10k Users
- Vercel: Pro plan
- Supabase: Pro plan
- No additional infrastructure needed

### Phase 2: 100k Users
- Vercel: Scale to multiple regions
- Supabase: Upgrade to larger instance
- Add Redis caching (Upstash)
- Consider CDN for videos (Cloudflare)

### Phase 3: 1M+ Users
- Dedicated database cluster
- Microservices for video processing
- Kubernetes for scalability
- Multi-region deployment

## Troubleshooting

### Issue: Build fails with "Out of memory"
**Solution**: Increase Vercel build timeout or reduce bundle size
```bash
npm run analyze # Check bundle
```

### Issue: Supabase slow queries
**Solution**: Add indexes, use EXPLAIN ANALYZE
```sql
EXPLAIN ANALYZE
SELECT * FROM legacy_videos WHERE user_id = 'xxx'
```

### Issue: CORS errors
**Solution**: Configure in Supabase → Settings → CORS
```
Allow Origins:
- https://chronovault.app
- https://*.chronovault.app
```

## Rollback

If deployment breaks production:

```bash
# Revert to previous deployment
vercel rollback

# Or manually deploy previous commit
git revert HEAD
git push
```

## Cost Estimation (Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| Vercel | $20 | Pro plan |
| Supabase | $25 | Pro plan + storage |
| Claude API | $500-1000 | ~1M tokens/day |
| ElevenLabs | $100-300 | Voice synthesis |
| D-ID | $200-500 | Video synthesis |
| Stripe | 2.9% + $0.30 | Transaction fees |
| Domain | $10 | Registrar |
| **Total** | **~$1000-2000** | Per month |

At 10k paying users ($9.99/mo):
- Revenue: ~$100k/month
- API costs: ~$1-2k/month
- Margin: ~50%+

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Configure Supabase
3. ✅ Setup monitoring
4. ✅ Enable automated backups
5. ✅ Configure CI/CD
6. ✅ Load test before launch
7. ✅ Setup error tracking
8. ✅ Plan scaling strategy
