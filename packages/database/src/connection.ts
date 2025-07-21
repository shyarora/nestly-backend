import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/nestly";

// Create postgres connection
const client = postgres(connectionString);

// Create drizzle database instance
export const db = drizzle(client);

// Export the client for migrations
export { client };
