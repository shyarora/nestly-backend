#!/bin/bash

# Development setup script for Nestly Backend

set -e

echo "🚀 Setting up Nestly Backend Development Environment..."

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt "18" ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

# Check PNPM
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing PNPM..."
    npm install -g pnpm
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. Please install Docker to run local services"
    echo "   You can continue without Docker but will need PostgreSQL and Redis running manually"
fi

echo "✅ Prerequisites check complete!"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env
    echo "✅ Environment file created. Please update .env with your configuration"
else
    echo "ℹ️  Environment file already exists"
fi

# Start Docker services if available
if command -v docker &> /dev/null; then
    echo "🐳 Starting Docker services (PostgreSQL, Redis)..."
    docker-compose up -d
    
    # Wait for PostgreSQL to be ready
    echo "⏳ Waiting for PostgreSQL to be ready..."
    until docker-compose exec postgres pg_isready -U postgres; do
        sleep 1
    done
    echo "✅ PostgreSQL is ready!"
else
    echo "⚠️  Skipping Docker services. Make sure PostgreSQL and Redis are running manually"
fi

# Generate database schema
echo "🗄️  Setting up database..."
pnpm db:generate
pnpm db:migrate

echo ""
echo "🎉 Setup complete! You can now start development with:"
echo ""
echo "   pnpm dev           # Start all services"
echo "   pnpm dev:gateway   # Start API Gateway only"
echo ""
echo "📊 GraphQL Playgrounds will be available at:"
echo "   http://localhost:4000/graphql  (API Gateway)"
echo "   http://localhost:4001/graphql  (Property Service)"
echo "   http://localhost:4002/graphql  (Auth Service)"
echo "   http://localhost:4003/graphql  (Booking Service)"
echo "   http://localhost:4004/graphql  (Payment Service)"
echo "   http://localhost:4005/graphql  (Review Service)"
echo "   http://localhost:4006/graphql  (Notification Service)"
echo ""
echo "📖 Don't forget to:"
echo "   1. Update .env with your API keys"
echo "   2. Configure Google OAuth credentials"
echo "   3. Set up Razorpay payment gateway"
echo ""
