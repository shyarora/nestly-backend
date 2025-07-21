import { db, sql } from "@nestly/database";

export const healthResolvers = {
    Query: {
        // Basic liveness check
        livez: async () => {
            return "API Gateway is alive";
        },

        // Readiness check with database connectivity
        readyz: async () => {
            try {
                // Test database connection
                await db.execute(sql`SELECT 1`);
                return "API Gateway is ready";
            } catch (error) {
                throw new Error("Database connection failed");
            }
        },

        // Hello world endpoint
        hello: async () => {
            return `Hello from Nestly API Gateway! ${new Date().toISOString()}`;
        },
    },
};
