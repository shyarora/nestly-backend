#!/bin/bash

# Script to create remaining microservices with health checks
# This creates the basic structure for all services

SERVICES=("auth-service" "booking-service" "payment-service" "review-service" "notification-service")
BASE_PORT=4002

for i in "${!SERVICES[@]}"; do
    SERVICE=${SERVICES[$i]}
    PORT=$((BASE_PORT + i))
    
    echo "Creating $SERVICE on port $PORT..."
    
    # Create directory structure
    mkdir -p "apps/$SERVICE/src/resolvers"
    mkdir -p "apps/$SERVICE/src/schema"
    mkdir -p "apps/$SERVICE/tests"
    
    # Create package.json
    cat > "apps/$SERVICE/package.json" << EOF
{
  "name": "$SERVICE",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch --clear-screen=false src/server.ts",
    "build": "tsup src/server.ts --format esm --target node18 --clean",
    "start": "node dist/server.js",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@apollo/server": "^4.10.0",
    "@apollo/subgraph": "^2.6.0",
    "@as-integrations/fastify": "^2.1.1",
    "fastify": "^4.26.0",
    "@fastify/cors": "^9.0.1",
    "graphql": "^16.8.1",
    "@nestly/database": "workspace:*",
    "@nestly/common": "workspace:*"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "tsx": "^4.7.0",
    "tsup": "^8.0.1",
    "typescript": "^5.3.3",
    "vitest": "^1.2.0"
  }
}
EOF

    # Create tsconfig.json
    cat > "apps/$SERVICE/tsconfig.json" << EOF
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["dist", "node_modules", "tests"]
}
EOF

    # Create health schema
    cat > "apps/$SERVICE/src/schema/health.graphql" << EOF
type Query {
  # Health check endpoints
  livez: String!
  readyz: String!
  hello: String!
}
EOF

    # Create health resolver
    SERVICE_NAME_CAPS=$(echo "$SERVICE" | sed 's/-/ /g' | sed 's/\b\w/\U&/g')
    cat > "apps/$SERVICE/src/resolvers/health.resolver.ts" << EOF
export const healthResolvers = {
  Query: {
    // Basic liveness check
    livez: async () => {
      return '$SERVICE_NAME_CAPS is alive'
    },

    // Readiness check
    readyz: async () => {
      try {
        // Add any readiness checks here (database, external services, etc.)
        return '$SERVICE_NAME_CAPS is ready'
      } catch (error) {
        throw new Error('$SERVICE_NAME_CAPS not ready')
      }
    },

    // Hello world endpoint
    hello: async () => {
      return \`Hello from Nestly $SERVICE_NAME_CAPS! \${new Date().toISOString()}\`
    },
  },
}
EOF

    # Create index resolver
    cat > "apps/$SERVICE/src/resolvers/index.ts" << EOF
import { healthResolvers } from './health.resolver'

export const resolvers = {
  Query: {
    ...healthResolvers.Query,
  },
}
EOF

    # Create server.ts
    cat > "apps/$SERVICE/src/server.ts" << EOF
import { ApolloServer } from '@apollo/server'
import fastifyApollo, { fastifyApolloDrainPlugin } from '@as-integrations/fastify'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { resolvers } from './resolvers/index.js'

const PORT = parseInt(process.env.PORT || '$PORT')
const HOST = process.env.HOST || 'localhost'

// Simple GraphQL schema for health checks
const typeDefs = \`
  type Query {
    livez: String!
    readyz: String!
    hello: String!
  }
\`

// Create Fastify instance
const fastify = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty'
    }
  }
})

// Register CORS
await fastify.register(cors, {
  origin: true,
  credentials: true
})

// Create Apollo Server
const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [fastifyApolloDrainPlugin(fastify)],
  introspection: process.env.NODE_ENV !== 'production',
})

// Start Apollo Server
await apollo.start()

// Register Apollo with Fastify
await fastify.register(fastifyApollo(apollo), {
  context: async (request: any, reply: any) => {
    return {
      req: request,
      reply: reply,
    }
  },
})

// Health check endpoints (REST for Kubernetes)
fastify.get('/livez', async () => {
  return { status: 'alive', service: '$SERVICE', timestamp: new Date().toISOString() }
})

fastify.get('/readyz', async () => {
  try {
    return { status: 'ready', service: '$SERVICE', timestamp: new Date().toISOString() }
  } catch (error) {
    fastify.log.error(error)
    throw new Error('Service not ready')
  }
})

// Start server
async function start() {
  try {
    await fastify.listen({ port: PORT, host: HOST })
    fastify.log.info(\`🚀 $SERVICE_NAME_CAPS running at http://\${HOST}:\${PORT}/graphql\`)
  } catch (error) {
    fastify.log.error(error)
    process.exit(1)
  }
}

start()
EOF

done

echo "All services created successfully!"
