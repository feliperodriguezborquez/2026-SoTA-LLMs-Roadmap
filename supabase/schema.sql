-- =============================================
-- Deep Understanding - Supabase Database Schema
-- =============================================
-- 
-- INSTRUCTIONS:
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to SQL Editor
-- 3. Create a new query
-- 4. Paste this entire file and run it
--

-- Enable UUID extension (usually enabled by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- User Progress Table
-- =============================================
-- Stores the learning progress for each user and resource

CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_id TEXT NOT NULL,
    status INTEGER DEFAULT 0 CHECK (status >= 0 AND status <= 4),
    -- 0 = Not Started
    -- 1 = In Progress
    -- 2 = Basic (completed with basic understanding)
    -- 3 = Intermediate (good understanding, can apply)
    -- 4 = Mastered (deep understanding, can teach)
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one record per user per resource
    UNIQUE(user_id, resource_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_resource_id ON user_progress(resource_id);

-- =============================================
-- Row Level Security (RLS)
-- =============================================
-- Ensures users can only access their own data

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own progress
CREATE POLICY "Users can view own progress" 
    ON user_progress 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own progress
CREATE POLICY "Users can insert own progress" 
    ON user_progress 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own progress
CREATE POLICY "Users can update own progress" 
    ON user_progress 
    FOR UPDATE 
    USING (auth.uid() = user_id);

-- Policy: Users can delete their own progress
CREATE POLICY "Users can delete own progress" 
    ON user_progress 
    FOR DELETE 
    USING (auth.uid() = user_id);

-- =============================================
-- Trigger to auto-update updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Optional: User Profiles Table
-- =============================================
-- For storing additional user info (display name, preferences)

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
    ON user_profiles 
    FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON user_profiles 
    FOR ALL 
    USING (auth.uid() = id);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO user_profiles (id, display_name)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- Done!
-- =============================================
-- After running this script:
-- 1. Go to Authentication > Providers
-- 2. Enable Email/Password
-- 3. (Optional) Enable Google and GitHub OAuth
-- 4. Copy your Project URL and anon key to config.js
