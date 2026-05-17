-- Migration: Fix accounts table schema
-- This migration ensures the accounts table doesn't have an is_deleted column
-- since the app now handles soft deletion at the application level if needed.

-- Check if is_deleted column exists and remove it if present
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'accounts' 
        AND column_name = 'is_deleted'
    ) THEN
        ALTER TABLE accounts DROP COLUMN IF EXISTS is_deleted;
    END IF;
END $$;

-- Note: User names are stored in Supabase auth.users table's raw_user_meta_data JSONB field
-- No migration needed for user names as they use built-in Supabase auth metadata
