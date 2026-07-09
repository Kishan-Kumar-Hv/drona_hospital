-- Digital Token Booking System: walk-in queue tokens, independent of
-- date/time. Token numbers are sequential and never reused.

CREATE TABLE IF NOT EXISTS tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token_number SERIAL UNIQUE NOT NULL,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_age INTEGER,
  patient_gender TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tokens_phone ON tokens (patient_phone);
CREATE INDEX IF NOT EXISTS idx_tokens_created_at ON tokens (created_at);

ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;

-- Reception staff (authenticated) manage everything
CREATE POLICY "allow_staff_select_all" ON tokens
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "allow_staff_update_all" ON tokens
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "allow_staff_insert" ON tokens
  FOR INSERT TO authenticated WITH CHECK (true);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON tokens TO authenticated;

-- Patients (anon) create a token via SECURITY DEFINER RPC, returning the
-- inserted row (including the assigned token_number).
CREATE OR REPLACE FUNCTION create_token(p_name TEXT, p_phone TEXT, p_age INT, p_gender TEXT)
RETURNS SETOF tokens
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO tokens (patient_name, patient_phone, patient_age, patient_gender)
  VALUES (p_name, p_phone, p_age, p_gender)
  RETURNING *;
END;
$$;

GRANT EXECUTE ON FUNCTION create_token(TEXT, TEXT, INT, TEXT) TO anon, authenticated;

-- Patients look up their own tokens by phone (no auth required)
CREATE OR REPLACE FUNCTION get_tokens_by_phone(p_phone TEXT)
RETURNS SETOF tokens
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM tokens WHERE patient_phone = p_phone ORDER BY created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION get_tokens_by_phone(TEXT) TO anon, authenticated;
