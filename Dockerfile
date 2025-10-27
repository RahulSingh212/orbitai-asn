# Multi-stage Dockerfile for OrbitAI - Frontend + Backend

# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install dependencies with clean config
RUN npm install --ignore-scripts

# Copy frontend source code
COPY frontend/ ./

# Build the frontend for production
RUN npm run build

# Stage 2: Setup Python backend and serve everything
FROM python:3.13-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/ .

# Copy the built frontend from stage 1 to backend/static
COPY --from=frontend-builder /frontend/dist ./static

# Create database directory
RUN mkdir -p /app/data

# Expose port (Cloud Run will set PORT env variable)
EXPOSE 8080

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Run database seeding and start the server
CMD python seed_data.py && uvicorn main:app --host 0.0.0.0 --port ${PORT}

