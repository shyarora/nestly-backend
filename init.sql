-- PostgreSQL initialization script for Nestly Backend
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions if they don't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Note: PostGIS is not needed for this application, commenting out
-- CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create database if it doesn't exist (usually handled by POSTGRES_DB env var)
-- The actual schema will be created by Drizzle migrations via npm run db:push

-- Optional: Create additional databases for different environments
-- CREATE DATABASE nestly_test;

-- Grant permissions (usually handled automatically by postgres image)
-- GRANT ALL PRIVILEGES ON DATABASE nestly TO nestly_user;
