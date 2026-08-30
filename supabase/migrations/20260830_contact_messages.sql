-- CleanAir India: Contact Messages Database Table & RLS Policies
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  topic TEXT NOT NULL DEFAULT 'Feedback',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anonymous form submissions via serverless function (Insert only)
CREATE POLICY "Allow service role and authenticated insert" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (true);

-- Only project admins can view stored messages
CREATE POLICY "Admins can read contact messages" 
ON public.contact_messages 
FOR SELECT 
USING (auth.role() = 'service_role');
