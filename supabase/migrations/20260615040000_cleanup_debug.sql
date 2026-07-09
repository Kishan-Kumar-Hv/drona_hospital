-- Remove temporary debugging RPCs used to diagnose the anon-insert RLS issue,
-- and remove the diagnostic test rows inserted during that process.
DROP FUNCTION IF EXISTS debug_whoami();
DROP FUNCTION IF EXISTS debug_policy_detail();

DELETE FROM appointments WHERE booking_reference = 'AH-TEST-0001';
