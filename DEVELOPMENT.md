# Nestly Backend - Development Setup

This document explains the improved development setup for the Nestly backend project.

## Architecture Overview

The project now uses a **simplified Docker setup** where:

- PostgreSQL runs in a Docker container
- The Node.js backend runs locally for development
- This provides fast development iteration while keeping database isolation

## Prerequisites

- Node.js (v18+ recommended)
- Docker and Docker Compose
- npm or yarn

## Quick Start

1. **Clone and install dependencies**

    ```bash
    git clone <repo-url>
    cd nestly-backend
    npm install
    ```

2. **Start PostgreSQL database**

    ```bash
    npm run docker:db
    ```

3. **Set up database schema**

    ```bash
    npm run db:push
    ```

4. **Start development server**

    ```bash
    npm run dev
    ```

5. **Access the API**
    - GraphQL Playground: http://localhost:4000/graphql
    - Health Check: http://localhost:4000/health
    - API Info: http://localhost:4000/

## Environment Configuration

The project uses environment variables defined in `.env` file:

```env
# Database Configuration
DATABASE_URL=postgresql://nestly_user:nestly_password@localhost:5432/nestly

# Server Configuration
PORT=4000
NODE_ENV=development

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

## Available Scripts

### Development

- `npm run dev` - Start development server with hot reload
- `npm run docker:db` - Start PostgreSQL database only
- `npm run setup` - Complete setup (database + schema)

### Database Management

- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate migration files
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset and recreate database schema

### Docker Commands

- `npm run docker:up` - Start all Docker services
- `npm run docker:down` - Stop all Docker services
- `npm run docker:logs` - View Docker logs
- `npm run docker:pgadmin` - Start pgAdmin (database management tool)

### Build & Deploy

- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run type-check` - Type checking without build

## Database Setup Details

### PostgreSQL Container

- **Image**: postgres:15-alpine
- **Container Name**: nestly-postgres
- **Port**: 5432
- **Database**: nestly
- **Username**: nestly_user
- **Password**: nestly_password

### pgAdmin (Optional)

```bash
npm run docker:pgadmin
```

Access at: http://localhost:8080

- Email: admin@nestly.com
- Password: admin123

## Development Workflow

1. **Daily Development**

    ```bash
    # Start database (if not running)
    npm run docker:db

    # Start development server
    npm run dev
    ```

2. **Schema Changes**

    ```bash
    # After modifying schema.ts
    npm run db:generate  # Generate migration
    npm run db:push      # Apply to database
    ```

3. **Clean Reset**
    ```bash
    npm run docker:down  # Stop containers
    npm run docker:db    # Start fresh database
    npm run db:push      # Apply schema
    npm run db:seed      # Add sample data
    ```

## Project Structure

```
nestly-backend/
├── src/
│   ├── db/
│   │   ├── index.ts      # Database connection
│   │   └── schema.ts     # Drizzle ORM schema
│   ├── resolvers/        # GraphQL resolvers
│   ├── lib/             # Utility libraries
│   ├── scripts/         # Database seeding scripts
│   └── index.ts         # Main application entry
├── drizzle/             # Database migrations
├── docker-compose.yml   # Docker configuration
├── .env                 # Environment variables
└── package.json         # Dependencies and scripts
```

## Troubleshooting

### Port Already in Use

```bash
# Kill processes on port 4000 or 5432
lsof -ti:4000 | xargs kill -9
lsof -ti:5432 | xargs kill -9
```

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker ps
npm run docker:logs

# Restart database
npm run docker:down
npm run docker:db
```

### Environment Variables Not Loading

- Ensure `.env` file exists in project root
- Check that dotenv is imported in relevant files
- Verify DATABASE_URL format is correct

## Production Deployment

For production, you can use the full Docker Compose setup:

```bash
# Build and start all services
docker-compose up -d

# Or use the production Dockerfile
docker build -t nestly-backend .
docker run -p 4000:4000 --env-file .env nestly-backend
```

## Key Improvements

1. **Simplified Development**: PostgreSQL in Docker, backend runs locally
2. **Fast Iteration**: No need to rebuild containers for code changes
3. **Environment Isolation**: Database state persists between restarts
4. **Easy Database Management**: Drizzle Studio and pgAdmin integration
5. **Flexible Scripts**: Granular control over services and database operations

## GraphQL API

Once running, you can explore the API at:

- **Apollo Studio**: http://localhost:4000/graphql
- **Schema**: Auto-generated from TypeGraphQL resolvers
- **Introspection**: Enabled in development mode

Example query:

```graphql
query {
    users {
        id
        email
        firstName
        lastName
    }
}
```
