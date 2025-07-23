-- Initialize database for Nestly
-- This script creates the database and basic extensions

-- Create database if it doesn't exist
SELECT 'CREATE DATABASE nestly'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'nestly')\gexec

-- Connect to the nestly database
\c nestly;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
-- CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geospatial queries (optional) - requires postgis package
