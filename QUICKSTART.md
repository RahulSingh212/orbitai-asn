# 🚀 OrbitAI - Quick Deployment to Google Cloud Run

## One-Command Deployment

```bash
# 1. Set your GCP project ID
export GCP_PROJECT_ID=your-project-id

# 2. Deploy!
./deploy.sh
```

That's it! Your app will be live in ~5 minutes. ✨

## What Happens

The deployment script will:

- ✅ Build React frontend
- ✅ Package with FastAPI backend
- ✅ Deploy to Google Cloud Run
- ✅ Give you a live URL

## First Time Setup

```bash
# Install gcloud CLI
# https://cloud.google.com/sdk/docs/install

# Login
gcloud auth login

# Create project
gcloud projects create orbitai-app

# Enable billing (required for Cloud Run)
# Visit: https://console.cloud.google.com/billing
```

## Environment Variables

```bash
# Required
export GCP_PROJECT_ID=your-project-id

# Optional
export GCP_REGION=us-central1  # Default region
```

## After Deployment

```bash
# View your app
gcloud run services describe orbitai --region us-central1 --format 'value(status.url)'

# View logs
gcloud run services logs tail orbitai

# Update deployment (after code changes)
./deploy.sh
```

## Cost

**Free Tier**: 2M requests/month

- Typical small app: ~$5-10/month
- Scales automatically
- Pay only for actual usage

## Need Help?

See full guide: [DEPLOYMENT.md](./DEPLOYMENT.md)

## Architecture

``` structure
┌─────────────────────────────────────┐
│     Google Cloud Run Container      │
│                                     │
│  ┌─────────────────────────────┐    │
│  │    FastAPI Backend          │    │
│  │  - API endpoints (/api/*)   │    │
│  │  - Database (SQLite)        │    │
│  │  - Serves static files      │    │
│  └─────────────────────────────┘    │
│              ↓                      │
│  ┌─────────────────────────────┐    │
│  │    React Frontend           │    │
│  │  - Built static files       │    │
│  │  - Served by FastAPI        │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
          ↓
    Public URL 🌐
```

## Troubleshooting

**Build fails?**

```bash
# Check logs
gcloud builds list
gcloud builds log [BUILD_ID]
```

**App won't start?**

```bash
# Check container logs
gcloud run services logs read orbitai --limit 50
```

**Need more memory?**

```bash
gcloud run services update orbitai --memory 1Gi
```

---
