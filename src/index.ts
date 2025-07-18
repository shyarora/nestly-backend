import "reflect-metadata";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { buildSchema } from "type-graphql";
import cors from "cors";
import { createContext } from "./lib/context";
import { client } from "./db";
import http from "http";

// Use the working simple resolvers instead of complex ones
import { SimpleUserResolver } from "./resolvers/SimpleUserResolver";
import { SimplePropertyResolver } from "./resolvers/SimplePropertyResolver";
import { SimpleAmenityResolver } from "./resolvers/SimpleAmenityResolver";

async function bootstrap() {
    try {
        // Test database connection
        await client`SELECT 1`;
        console.log("✅ Connected to database");
    } catch (error) {
        console.error("❌ Failed to connect to database:", error);
        process.exit(1);
    }

    // Create Express app and HTTP server
    const app = express();
    const httpServer = http.createServer(app);

    // Build GraphQL schema with simple resolvers
    const schema = await buildSchema({
        resolvers: [SimpleUserResolver, SimplePropertyResolver, SimpleAmenityResolver],
        validate: false,
        authChecker: ({ context }: { context: any }) => {
            // Return true if user is authenticated, false otherwise
            return !!context.user;
        },
    });

    // Create Apollo Server
    const server = new ApolloServer({
        schema,
        introspection: true,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        formatError: err => {
            console.error("GraphQL Error:", err);
            return {
                message: err.message,
                locations: err.locations,
                path: err.path,
                extensions: {
                    code: err.extensions?.code,
                    stacktrace: process.env.NODE_ENV === "development" ? (err as any).stack : undefined,
                },
            };
        },
    });

    // Start the server
    await server.start();

    // Apply global middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Apply CORS middleware
    app.use(
        cors({
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            credentials: true,
        }),
    );

    // Apply Apollo GraphQL middleware
    app.use(
        "/graphql",
        expressMiddleware(server, {
            context: async ({ req }) => createContext(req),
        }),
    );

    // Health check endpoint
    app.get("/health", (req, res) => {
        res.json({
            status: "ok",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || "development",
        });
    });

    // Root endpoint
    app.get("/", (req, res) => {
        res.json({
            message: "Nestly GraphQL API",
            graphql: "/graphql",
            sandbox: "/graphql (Apollo Studio)",
            health: "/health",
            version: "1.0.0",
        });
    });

    const PORT = process.env.PORT || 4000;

    httpServer.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
        console.log(`🎮 Apollo Studio Sandbox available at http://localhost:${PORT}/graphql`);
        console.log(`💚 Health check: http://localhost:${PORT}/health`);
        console.log(`🏠 API Info: http://localhost:${PORT}/`);
    });
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
    console.log("\n🔄 Shutting down gracefully...");
    await client.end();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    console.log("\n🔄 Shutting down gracefully...");
    await client.end();
    process.exit(0);
});

bootstrap().catch(error => {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
});
