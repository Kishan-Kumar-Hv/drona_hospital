CREATE OR REPLACE FUNCTION debug_policy_detail()
RETURNS TABLE (
  tablename TEXT,
  policyname TEXT,
  permissive TEXT,
  roles TEXT[],
  cmd TEXT,
  qual TEXT,
  with_check TEXT,
  forcerowsecurity BOOLEAN
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.tablename, p.policyname, p.permissive, p.roles, p.cmd,
         p.qual::text, p.with_check::text,
         c.relforcerowsecurity
  FROM pg_policies p
  JOIN pg_class c ON c.relname = p.tablename
  WHERE p.tablename IN ('appointments', 'callback_requests');
$$;

GRANT EXECUTE ON FUNCTION debug_policy_detail() TO anon, authenticated;
