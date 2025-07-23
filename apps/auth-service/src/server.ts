import { ApolloServer } from "@apollo/server";
import fastifyApollo, { fastifyApolloDrainPlugin } from "@as-integrations/fastify";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { resolvers } from "./resolvers/index.js";
import { typeDefs } from "./schema/index.js";
import { createAuthContext } from "./middleware/auth.middleware.js";

const PORT = parseInt(process.env.PORT || "5002");
const HOST = process.env.HOST || "localhost";

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
        return { status: "ready", service: "auth-service", timestamp: new Date().toISOString() };
    } catch (error) {
        fastify.log.error(error);
        throw new Error("Service not ready");
    }
});

// Start server
async function start() {
    try {
        await fastify.listen({ port: PORT, host: HOST });
        fastify.log.info(`🚀 auth service running at http://${HOST}:${PORT}/graphql`);
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
}

start();
