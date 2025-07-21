# Development Guide

## 🚀 Getting Started

### 1. Initial Setup

```bash
# Run the setup script
./setup.sh

# Or manually:
pnpm install
cp .env.example .env
pnpm docker:dev
pnpm db:generate
pnpm db:migrate
```

### 2. Start Development

```bash
# Start all services
pnpm dev

# Stop all services
pnpm stop

# Or start services individually
pnpm dev:gateway      # API Gateway (port 5000)
pnpm dev:property     # Property Service (port 5001)
pnpm dev:auth         # Auth Service (port 5002)
pnpm dev:booking      # Booking Service (port 5003)
pnpm dev:payment      # Payment Service (port 5004)
pnpm dev:review       # Review Service (port 5005)
pnpm dev:notification # Notification Service (port 5006)
```

## 🏗️ Service Architecture

### Health Check Endpoints

Every service provides these endpoints:

#### GraphQL Queries

```graphql
query {
    livez # Returns: "Service Name is alive"
    readyz # Returns: "Service Name is ready" (with dependency checks)
    hello # Returns: "Hello from Service! timestamp"
}
```

#### REST Endpoints

```bash
GET /livez   # Kubernetes liveness probe
GET /readyz  # Kubernetes readiness probe
```

### Service Ports

- **API Gateway**: 5000
- **Property Service**: 5001
- **Auth Service**: 5002
- **Booking Service**: 5003
- **Payment Service**: 5004
- **Review Service**: 5005
- **Notification Service**: 5006

## 🧪 Testing Health Checks

### Test GraphQL Health Endpoints

```bash
# Test API Gateway
curl -X POST http://localhost:5000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ livez readyz hello }"}'

# Test Property Service
curl -X POST http://localhost:5001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ livez readyz hello }"}'
```

### Test REST Health Endpoints

```bash
# Test all services
for port in 5000 5001 5002 5003 5004 5005 5006; do
  echo "Testing port $port:"
  curl -s http://localhost:$port/livez | jq
  curl -s http://localhost:$port/readyz | jq
  echo "---"
done
```

## 📊 GraphQL Playgrounds

Visit these URLs in your browser:

- http://localhost:5000/graphql - API Gateway
- http://localhost:5001/graphql - Property Service
- http://localhost:5002/graphql - Auth Service
- http://localhost:5003/graphql - Booking Service
- http://localhost:5004/graphql - Payment Service
- http://localhost:5005/graphql - Review Service
- http://localhost:5006/graphql - Notification Service

## 🗄️ Database Operations

### Drizzle Commands

```bash
# Generate migration files
pnpm db:generate

# Run migrations
pnpm db:migrate

# Open Drizzle Studio (database GUI)
pnpm db:studio

# Seed test data
pnpm db:seed
```

### Manual Database Access

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d nestly

# Or via connection string
psql postgresql://postgres:password@localhost:5432/nestly
```

## 🐳 Docker Development

### Start Services

```bash
# Start PostgreSQL and Redis
pnpm docker:dev

# Stop services
pnpm docker:down

# View logs
docker-compose logs -f postgres
docker-compose logs -f redis
```

### Docker Service Status

```bash
docker-compose ps
```

## 🔧 Development Tools

### Build Commands

```bash
pnpm build           # Build all services
pnpm build:gateway   # Build specific service
```

### Code Quality

```bash
pnpm lint            # Lint all code
pnpm type-check      # TypeScript checking
pnpm test            # Run tests
```

### Clean Commands

```bash
pnpm clean           # Clean all build artifacts
```

## 🚦 Service Management

### Quick Commands

```bash
# Start all services
pnpm dev

# Stop all running services
pnpm stop

# Check health of all services
./check-health.sh

# Start individual services
pnpm dev:gateway      # API Gateway only
pnpm dev:property     # Property Service only
# ... etc
```

## 🚦 Service Health Monitoring

### Check All Services Status

```bash
#!/bin/bash
# Save as check-services.sh

services=(
  "API Gateway:5000"
  "Property Service:5001"
  "Auth Service:5002"
  "Booking Service:5003"
  "Payment Service:5004"
  "Review Service:5005"
  "Notification Service:5006"
)

for service in "${services[@]}"; do
  name="${service%:*}"
  port="${service#*:}"

  echo "Checking $name..."
  if curl -s http://localhost:$port/livez > /dev/null; then
    echo "✅ $name is running on port $port"
  else
    echo "❌ $name is not responding on port $port"
  fi
done
```

## 🔐 Environment Configuration

### Required Environment Variables

```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/nestly

# Authentication
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret

# Payments
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Services (for production microservices)
PROPERTY_SERVICE_URL=http://property-service:4001
AUTH_SERVICE_URL=http://auth-service:4002
```

## 📝 Next Steps

After setting up the basic structure, you can:

1. **Implement Authentication**
    - Google OAuth integration
    - JWT token management
    - User profile management

2. **Build Property Management**
    - Property CRUD operations
    - Image upload handling
    - Search and filtering

3. **Develop Booking System**
    - Availability calendar
    - Booking conflicts resolution
    - Pricing calculation

4. **Integrate Payments**
    - Razorpay payment flow
    - Webhook handling
    - Refund processing

5. **Add Reviews & Ratings**
    - Review submission
    - Rating aggregation
    - Moderation system

6. **Implement Notifications**
    - Email templates
    - Real-time messaging
    - Push notifications

## 🐛 Troubleshooting

### Common Issues

#### Services not starting

```bash
# Stop all running services
pnpm stop

# Check if ports are available
lsof -i :5000-5006

# Kill processes if needed (alternative method)
pkill -f "tsx watch"
```

#### Database connection issues

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart PostgreSQL
docker-compose restart postgres
```

#### TypeScript errors

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Logs and Debugging

```bash
# View service logs (when running with pnpm dev)
# Logs will appear in the terminal

# For Docker services
docker-compose logs -f postgres
docker-compose logs -f redis
```
