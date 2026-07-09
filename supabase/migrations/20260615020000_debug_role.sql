-- Temporary diagnostic RPC to inspect what role/claims PostgREST resolves
-- for a given API request. Safe to drop after debugging.
CREATE OR REPLACE FUNCTION debug_whoami()
RETURNS TABLE (
  current_role_name TEXT,
  jwt_claims TEXT,
  rls_enabled_appointments BOOLEAN,
  rls_enabled_callback BOOLEAN,
  appointments_policies TEXT[],
  callback_policies TEXT[]
)
LANGUAGE sql
SECURITY INVOKER
AS $$
  SELECT
    current_user::text,
    coalesce(current_setting('request.jwt.claims', true), 'none'),
    (SELECT relrowsecurity FROM pg_class WHERE relname = 'appointments'),
    (SELECT relrowsecurity FROM pg_class WHERE relname = 'callback_requests'),
    (SELECT array_agg(policyname || ' [' || array_to_string(roles, ',') || '] ' || cmd)
       FROM pg_policies WHERE tablename = 'appointments'),
    (SELECT array_agg(policyname || ' [' || array_to_string(roles, ',') || '] ' || cmd)
       FROM pg_policies WHERE tablename = 'callback_requests');
$$;

GRANT EXECUTE ON FUNCTION debug_whoami() TO anon, authenticated;
