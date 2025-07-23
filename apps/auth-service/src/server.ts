import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local in the auth-service directory
const envPath = path.join(__dirname, "../.env.local");
dotenv.config({ path: envPath });

import { ApolloServer } from "@apollo/server";
import fastifyApollo, { fastifyApolloDrainPlugin } from "@as-integrations/fastify";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { resolvers } from "./resolvers/index.js";
import { typeDefs } from "./schema/index.js";
import { createAuthContext } from "./middleware/auth.middleware.js";
import { db, sql } from "@nestly/database";

const PORT = parseInt(process.env.PORT || "5002");
const HOST = process.env.HOST || "localhost";

// Database connection test function
async function testDatabaseConnection(): Promise<boolean> {
    try {
        await db.execute(sql`SELECT 1`);
        return true;
    } catch (error) {
        console.error("Database connection failed:", error);
        return false;
    }
}

// Create Fastify instance
const fastify = Fastify({
    logger: true,
});

// Register CORS
await fastify.register(cors, {
    origin: true,
    credentials: true,
});

// Create Apollo Server
const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [fastifyApolloDrainPlugin(fastify)],
    introspection: process.env.NODE_ENV !== "production",
});

// Start Apollo Server
await apollo.start();

// Register Apollo with Fastify
await fastify.register(fastifyApollo(apollo), {
    context: async request => {
        return await createAuthContext(request);
    },
});

// Health check endpoints (REST for Kubernetes)
fastify.get("/livez", async () => {
    return { status: "alive", service: "auth-service", timestamp: new Date().toISOString() };
});

fastify.get("/readyz", async () => {
    try {
        const dbConnected = await testDatabaseConnection();
        if (!dbConnected) {
            throw new Error("Database connection failed");
        }
        return {
            status: "ready",
            service: "auth-service",
            database: "connected",
            timestamp: new Date().toISOString(),
        };
    } catch (error) {
        fastify.log.error(error);
        throw new Error("Service not ready");
    }
});

// Start server
async function start() {
    try {
        // Test database connection on startup
        fastify.log.info("🔌 Testing database connection...");
        const dbConnected = await testDatabaseConnection();

        if (dbConnected) {
            fastify.log.info("✅ Database connection successful");
        } else {
            fastify.log.error("❌ Database connection failed");
            fastify.log.info("📋 Current DATABASE_URL:", process.env.DATABASE_URL);
            // Continue anyway for development
        }

        await fastify.listen({ port: PORT, host: HOST });
        fastify.log.info(`🚀 Auth service running at http://${HOST}:${PORT}/graphql`);
        fastify.log.info(`📊 GraphQL Playground: http://${HOST}:${PORT}/graphql`);
        fastify.log.info(`🔍 Health checks: http://${HOST}:${PORT}/livez | http://${HOST}:${PORT}/readyz`);
        fastify.log.info(`🗄️  Database: ${dbConnected ? "✅ Connected" : "❌ Disconnected"}`);
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
}

start();
