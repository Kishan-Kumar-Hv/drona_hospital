-- Create appointments table for the Appointment Booking System (MVP2)
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_reference TEXT UNIQUE NOT NULL,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_email TEXT,
  patient_age INTEGER,
  patient_gender TEXT,
  doctor_id TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  department TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prevent double-booking the same doctor/date/time slot (cancelled slots can be rebooked)
CREATE UNIQUE INDEX IF NOT EXISTS idx_appointments_unique_slot
  ON appointments (doctor_id, appointment_date, appointment_time)
  WHERE status <> 'cancelled';

CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments (appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_phone ON appointments (patient_phone);

-- Keep updated_at current
CREATE OR REPLACE FUNCTION set_appointments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_appointments_updated_at ON appointments;
CREATE TRIGGER trg_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION set_appointments_updated_at();

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Patients (anon) can create their own appointment requests
CREATE POLICY "allow_public_insert" ON appointments
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Reception staff (authenticated) can see and manage everything
CREATE POLICY "allow_staff_select_all" ON appointments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "allow_staff_update_all" ON appointments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "allow_staff_insert" ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "allow_staff_delete" ON appointments
  FOR DELETE
  TO authenticated
  USING (true);

-- RPC: return only the appointment_time values already booked for a doctor/date,
-- so the booking UI can disable taken slots without exposing patient data to anon users.
CREATE OR REPLACE FUNCTION get_booked_slots(p_doctor_id TEXT, p_date DATE)
RETURNS TABLE (appointment_time TEXT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT appointment_time
  FROM appointments
  WHERE doctor_id = p_doctor_id
    AND appointment_date = p_date
    AND status <> 'cancelled';
$$;

GRANT EXECUTE ON FUNCTION get_booked_slots(TEXT, DATE) TO anon, authenticated;

-- RPC: patients look up their own appointments by phone number (no auth required)
CREATE OR REPLACE FUNCTION get_appointments_by_phone(p_phone TEXT)
RETURNS SETOF appointments
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT *
  FROM appointments
  WHERE patient_phone = p_phone
  ORDER BY appointment_date DESC, appointment_time DESC;
$$;

GRANT EXECUTE ON FUNCTION get_appointments_by_phone(TEXT) TO anon, authenticated;

-- RPC: patients cancel their own appointment (verified by phone match)
CREATE OR REPLACE FUNCTION cancel_appointment(p_id UUID, p_phone TEXT)
RETURNS SETOF appointments
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  UPDATE appointments
  SET status = 'cancelled'
  WHERE id = p_id
    AND patient_phone = p_phone
    AND status <> 'cancelled'
  RETURNING *;
END;
$$;

GRANT EXECUTE ON FUNCTION cancel_appointment(UUID, TEXT) TO anon, authenticated;
