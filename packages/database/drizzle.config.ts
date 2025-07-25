import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

export default {
    schema: "./src/schemas/*.schema.ts",
    out: "./src/migrations",
    driver: "pg",
    dbCredentials: {
        connectionString: process.env.DATABASE_URL || "",
    },
    verbose: true,
    strict: true,
} satisfies Config;
