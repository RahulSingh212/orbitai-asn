# OrbitAI - Google Cloud Run Deployment Guide

This guide explains how to deploy OrbitAI (React frontend + FastAPI backend) as a single service on Google Cloud Run.

## 🏗️ Architecture

- **Single Deployment**: FastAPI serves both API endpoints and static React frontend
- **Container**: Multi-stage Docker build that compiles frontend and packages with backend
- **Database**: SQLite database with seeded university data
- **Port**: 8080 (Cloud Run standard)

## 📋 Prerequisites

1. **Google Cloud Account**: [Sign up here](https://cloud.google.com/)
2. **GCloud CLI**: [Install instructions](https://cloud.google.com/sdk/docs/install)
3. **GCP Project**: Create a project in [GCP Console](https://console.cloud.google.com/)
4. **Billing Enabled**: Cloud Run requires billing to be enabled

## 🚀 Quick Deployment

### Step 1: Setup GCP Project

```bash
# Login to Google Cloud
gcloud auth login

# Create a new project (or use existing)
gcloud projects create orbitai-app --name="OrbitAI"

# Set your project ID
export GCP_PROJECT_ID=orbitai-app

# Set billing account (get account ID from console)
gcloud billing accounts list
gcloud billing projects link ${GCP_PROJECT_ID} --billing-account=ACCOUNT_ID
```

### Step 2: Configure Deployment

```bash
# Set your GCP project ID
export GCP_PROJECT_ID=your-project-id

# Optional: Change region (default: us-central1)
export GCP_REGION=us-central1
```

### Step 3: Deploy

```bash
# Run the deployment script
./deploy.sh
```

The script will:

1. ✅ Enable required GCP APIs (Cloud Build, Cloud Run, Container Registry)
2. ✅ Build Docker image with both frontend and backend
3. ✅ Push image to Google Container Registry
4. ✅ Deploy to Cloud Run
5. ✅ Make service publicly accessible
6. ✅ Display your live URL

## 🔧 Manual Deployment (Step by Step)

If you prefer to deploy manually:

### 1. Enable APIs

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 2. Build Docker Image

```bash
# Build and push to Container Registry
gcloud builds submit --tag gcr.io/${GCP_PROJECT_ID}/orbitai
```

### 3. Deploy to Cloud Run

```bash
gcloud run deploy orbitai \
  --image gcr.io/${GCP_PROJECT_ID}/orbitai \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --port 8080
```

### 4. Get Service URL

```bash
gcloud run services describe orbitai \
  --region us-central1 \
  --format 'value(status.url)'
```

## 📊 Post-Deployment

### View Logs

```bash
# Stream logs in real-time
gcloud run services logs tail orbitai --region us-central1

# View logs in Console
# https://console.cloud.google.com/logs
```

### View Metrics

```bash
# Open Cloud Run console
# https://console.cloud.google.com/run
```

### Test the Deployment

```bash
# Get your service URL
SERVICE_URL=$(gcloud run services describe orbitai --region us-central1 --format 'value(status.url)')

# Test API health
curl ${SERVICE_URL}/health

# Test frontend (should return HTML)
curl ${SERVICE_URL}/
```

## 🔐 Security Configuration

### Make Service Private (Authenticated Only)

```bash
gcloud run services update orbitai \
  --region us-central1 \
  --no-allow-unauthenticated
```

### Add Custom Domain

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service orbitai \
  --domain your-domain.com \
  --region us-central1
```

## 💰 Cost Optimization

Cloud Run pricing is based on:

- **CPU/Memory usage** (only when handling requests)
- **Number of requests**
- **Data egress**

**Free Tier**: 2M requests/month, 360K GB-seconds memory, 180K vCPU-seconds

### Optimize Costs

```bash
# Reduce memory
gcloud run services update orbitai --memory 256Mi

# Reduce max instances
gcloud run services update orbitai --max-instances 5

# Set min instances to 0 (auto-scale to zero)
gcloud run services update orbitai --min-instances 0
```

## 🔄 Update Deployment

After making code changes:

```bash
# Simply run deploy script again
./deploy.sh
```

Or manually:

```bash
# Build new image
gcloud builds submit --tag gcr.io/${GCP_PROJECT_ID}/orbitai

# Cloud Run will automatically use the new image
# (Or force new revision)
gcloud run deploy orbitai --image gcr.io/${GCP_PROJECT_ID}/orbitai
```

## 🧪 Local Testing (Before Deployment)

Test the Docker container locally:

```bash
# Build image locally
docker build -t orbitai:local .

# Run container
docker run -p 8080:8080 orbitai:local

# Open browser
open http://localhost:8080
```

## 🐛 Troubleshooting

### Build Fails

```bash
# Check build logs
gcloud builds list --limit 5
gcloud builds log [BUILD_ID]
```

### Service Won't Start

```bash
# Check logs
gcloud run services logs read orbitai --limit 50

# Check service status
gcloud run services describe orbitai --region us-central1
```

### Database Issues

The SQLite database is created fresh on each deployment. If you need persistent storage, consider:

- Google Cloud SQL (PostgreSQL/MySQL)
- Cloud Storage for SQLite file
- Firestore/Datastore

### Memory Issues

```bash
# Increase memory
gcloud run services update orbitai --memory 1Gi
```

## 📚 Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Run Pricing](https://cloud.google.com/run/pricing)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Vite Production Build](https://vitejs.dev/guide/build.html)

## 🎉 Success

Your OrbitAI app is now live on Google Cloud Run! 🚀

Share your deployment URL and start matching students with universities!
