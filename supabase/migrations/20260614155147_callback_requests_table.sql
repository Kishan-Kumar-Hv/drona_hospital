-- Create callback_requests table
CREATE TABLE IF NOT EXISTS callback_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  department TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending'
);

-- Enable RLS
ALTER TABLE callback_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for callback_requests (allow public inserts for the form)
CREATE POLICY "allow_public_insert" ON callback_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_callback_requests_created_at ON callback_requests(created_at DESC);