-- SuperMarket Receipt Manager Database Initialization
-- This script runs automatically when PostgreSQL container starts for the first time

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
SET timezone = 'UTC';

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE supermarket_receipts TO postgres;

-- Create database if it doesn't exist (already created by POSTGRES_DB env var)
-- Additional setup can be added here as the application grows