#!/bin/bash

# Deployment script for Oracle VM
# Run this on your Oracle VM

set -e

echo "🚀 Starting Nestly deployment..."

# Update system
sudo dnf update -y

# Install Node.js if not already installed
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo dnf install -y nodejs
fi

# Install PM2 for process management
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    sudo npm install -g pm2
fi

# Clone or update repository
if [ -d "nestly" ]; then
    echo "📂 Updating repository..."
    cd nestly
    git pull origin main
else
    echo "📂 Cloning repository..."
    git clone https://github.com/shyarora/nestly.git
    cd nestly
fi

# Navigate to backend
cd backend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Set up environment variables
echo "⚙️ Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️  Please update .env file with your database credentials"
    echo "⚠️  Update DATABASE_URL, JWT_SECRET, and CORS_ORIGINS"
    exit 1
fi

# Build the application
echo "🔨 Building application..."
npm run build

# Generate and push database schema
echo "🗄️ Setting up database..."
npm run db:generate
npm run db:push

# Seed database (optional)
echo "🌱 Seeding database..."
npm run db:seed || echo "⚠️  Seeding failed, continuing..."

# Start with PM2
echo "🚀 Starting application with PM2..."
pm2 delete nestly-api || true
pm2 start dist/index.js --name nestly-api

# Save PM2 configuration
pm2 save
pm2 startup

echo "✅ Deployment complete!"
echo "🔗 API available at: http://your-vm-ip:4000/graphql"
echo "📊 PM2 status: pm2 status"
echo "📋 PM2 logs: pm2 logs nestly-api"
