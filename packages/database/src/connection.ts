import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/nestly";

// Create postgres connection with better error handling
const client = postgres(connectionString, {
    onnotice: () => {}, // Suppress notice logs
    max: 10, // Maximum number of connections
    idle_timeout: 20,
    connect_timeout: 10,
});

// Create drizzle database instance
export const db = drizzle(client);

// Export the client and sql for migrations and queries
export { client, sql };

// Database health check function
export async function checkDatabaseHealth(): Promise<{ connected: boolean; error?: string }> {
    try {
        await db.execute(sql`SELECT 1`);
        return { connected: true };
    } catch (error) {
        return {
            connected: false,
            error: error instanceof Error ? error.message : "Unknown database error",
        };
    }
}
