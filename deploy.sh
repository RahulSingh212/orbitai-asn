#!/bin/bash

# OrbitAI - Google Cloud Run Deployment Script
# This script builds and deploys both frontend and backend to Cloud Run

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 OrbitAI - Cloud Run Deployment${NC}"
echo "=================================="

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-your-gcp-project-id}"
SERVICE_NAME="orbitai"
REGION="${GCP_REGION:-us-central1}"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Error: gcloud CLI is not installed${NC}"
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if PROJECT_ID is set
if [ "$PROJECT_ID" = "your-gcp-project-id" ]; then
    echo -e "${RED}❌ Error: Please set your GCP_PROJECT_ID${NC}"
    echo "Example: export GCP_PROJECT_ID=my-project-123"
    exit 1
fi

echo -e "${GREEN}✓ Using Project: ${PROJECT_ID}${NC}"
echo -e "${GREEN}✓ Service Name: ${SERVICE_NAME}${NC}"
echo -e "${GREEN}✓ Region: ${REGION}${NC}"
echo ""

# Set the project
echo -e "${BLUE}📋 Setting GCP project...${NC}"
gcloud config set project ${PROJECT_ID}

# Enable required APIs
echo -e "${BLUE}🔧 Enabling required APIs...${NC}"
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build the Docker image
echo -e "${BLUE}🔨 Building Docker image...${NC}"
gcloud builds submit --tag ${IMAGE_NAME}

# Deploy to Cloud Run
echo -e "${BLUE}🚢 Deploying to Cloud Run...${NC}"
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --port 8080 \
  --set-env-vars "PYTHONUNBUFFERED=1"

# Get the service URL
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format 'value(status.url)')

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo -e "${GREEN}🌐 Your app is live at:${NC}"
echo -e "${BLUE}${SERVICE_URL}${NC}"
echo ""
echo -e "${GREEN}📊 View logs:${NC}"
echo "gcloud run services logs tail ${SERVICE_NAME} --region ${REGION}"
echo ""
echo -e "${GREEN}📈 View in Console:${NC}"
echo "https://console.cloud.google.com/run/detail/${REGION}/${SERVICE_NAME}"

