-- Diagnostic + fix for anon INSERT being rejected by RLS.
-- Run this whole block in the Supabase SQL Editor.

-- 1. Make sure the anon/authenticated roles have base table privileges
--    (RLS policies are evaluated AFTER privilege checks; without GRANTs,
--    PostgREST gets a permission error before RLS even applies, but some
--    Supabase project templates don't pre-grant these on tables created
--    via the SQL editor).
GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT, INSERT ON public.callback_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT INSERT ON public.appointments TO anon;

-- 2. Re-create the anon insert policies explicitly (idempotent)
DROP POLICY IF EXISTS "allow_public_insert" ON public.callback_requests;
CREATE POLICY "allow_public_insert" ON public.callback_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "allow_public_insert" ON public.appointments;
CREATE POLICY "allow_public_insert" ON public.appointments
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 3. Diagnostic: list all policies + grants for these tables so we can confirm
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('appointments', 'callback_requests');

SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE table_name IN ('appointments', 'callback_requests')
  AND grantee IN ('anon', 'authenticated')
ORDER BY table_name, grantee, privilege_type;
