-- ====================================================================
-- Holamaatu (Maize Advisory) - Supabase Database Schema
-- Run this script in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ====================================================================

-- 1. Create 'farmers' table
CREATE TABLE IF NOT EXISTS public.farmers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    location TEXT DEFAULT 'Dharwad',
    stage TEXT DEFAULT '30 days',
    soil TEXT DEFAULT 'Black Soil',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create 'chat_logs' table to persist farmer interactions
CREATE TABLE IF NOT EXISTS public.chat_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id TEXT REFERENCES public.farmers(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'bot')),
    message TEXT NOT NULL,
    advisory JSONB,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Indexes for fast query lookup
CREATE INDEX IF NOT EXISTS idx_farmers_phone ON public.farmers(phone);
CREATE INDEX IF NOT EXISTS idx_chat_logs_farmer_id ON public.chat_logs(farmer_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_created_at ON public.chat_logs(created_at);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;

-- 5. Drop old policies if they exist (allows safe re-running)
DROP POLICY IF EXISTS "Allow anon all on farmers" ON public.farmers;
DROP POLICY IF EXISTS "Allow anon all on chat_logs" ON public.chat_logs;

-- 6. Create policies allowing anonymous access via the Supabase Anon key
CREATE POLICY "Allow anon all on farmers" 
    ON public.farmers 
    FOR ALL 
    TO anon, authenticated 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Allow anon all on chat_logs" 
    ON public.chat_logs 
    FOR ALL 
    TO anon, authenticated 
    USING (true) 
    WITH CHECK (true);

-- 7. Trigger to automatically update 'updated_at' timestamp on profile changes
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_farmer_updated ON public.farmers;
CREATE TRIGGER on_farmer_updated
    BEFORE UPDATE ON public.farmers
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
