-- Create database if it doesn't exist (PostgreSQL will create it via POSTGRES_DB env var)
-- This file is for any additional initialization if needed

-- Create extension for UUID generation (optional, for future use)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The tables will be created automatically by Hibernate based on JPA entities
-- This script is mainly for any initial data or custom configurations

-- You can add any custom indexes here for better performance
-- CREATE INDEX IF NOT EXISTS idx_project_user_id ON project(user_id);
-- CREATE INDEX IF NOT EXISTS idx_task_project_id ON task(project_id);
-- CREATE INDEX IF NOT EXISTS idx_task_completed ON task(completed);

-- Set timezone to UTC for consistency
SET timezone = 'UTC';