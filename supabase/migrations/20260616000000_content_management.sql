-- Content Management tables: doctors, services, facilities, testimonials,
-- faqs, hospital_settings. All publicly readable (anon + authenticated),
-- writable only by authenticated (reception staff).

-- ============ doctors ============
-- Unifies the old hospitalData.doctors (display info) and
-- bookingData.bookingDoctors (booking schedule) into one table, which is
-- also the source of truth for booking departments.
CREATE TABLE IF NOT EXISTS doctors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  qualifications TEXT NOT NULL,
  experience TEXT NOT NULL,
  department TEXT NOT NULL,
  image TEXT NOT NULL,
  working_days INT[] NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  slot_minutes INT NOT NULL,
  consultation_fee INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ services ============
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ facilities ============
CREATE TABLE IF NOT EXISTS facilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ testimonials ============
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  rating INT NOT NULL,
  text TEXT NOT NULL,
  avatar TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ faqs ============
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============ hospital_settings (single row, id = 1) ============
CREATE TABLE IF NOT EXISTS hospital_settings (
  id INT PRIMARY KEY DEFAULT 1,
  name TEXT NOT NULL,
  local_name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  address_street TEXT NOT NULL,
  address_city TEXT NOT NULL,
  address_state TEXT NOT NULL,
  address_pincode TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  emergency_phone TEXT NOT NULL,
  working_hours TEXT NOT NULL,
  map_url TEXT NOT NULL,
  map_embed_url TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  social_facebook TEXT NOT NULL,
  social_instagram TEXT NOT NULL,
  social_twitter TEXT NOT NULL,
  social_linkedin TEXT NOT NULL,
  CONSTRAINT hospital_settings_single_row CHECK (id = 1)
);

-- ============ RLS + grants ============
-- Public read, staff (authenticated) full write, for all 6 tables.
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['doctors', 'services', 'facilities', 'testimonials', 'faqs', 'hospital_settings']
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('GRANT USAGE ON SCHEMA public TO anon, authenticated');
    EXECUTE format('GRANT SELECT ON %I TO anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON %I TO authenticated', t);

    EXECUTE format('DROP POLICY IF EXISTS "allow_public_read" ON %I', t);
    EXECUTE format('CREATE POLICY "allow_public_read" ON %I FOR SELECT TO anon, authenticated USING (true)', t);

    EXECUTE format('DROP POLICY IF EXISTS "allow_staff_write" ON %I', t);
    EXECUTE format('CREATE POLICY "allow_staff_write" ON %I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t);
  END LOOP;
END $$;

-- ============ Seed data (matches current static content) ============

INSERT INTO doctors (id, name, specialty, qualifications, experience, department, image, working_days, start_time, end_time, slot_minutes, consultation_fee) VALUES
  ('dr-anjali-sharma', 'Dr. Anjali Sharma', 'Senior Consultant Dentist', 'BDS, MDS (Orthodontics)', '18+ Years Experience', 'Dentistry', 'https://images.pexels.com/photos/545229/pexels-photo-545229.jpeg?auto=compress&cs=tinysrgb&w=400', ARRAY[1,2,3,4,5,6], '10:00', '14:00', 20, 500),
  ('dr-rajesh-kulkarni', 'Dr. Rajesh Kulkarni', 'Consultant General Physician', 'MBBS, MD (General Medicine)', '15+ Years Experience', 'General Medicine', 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400', ARRAY[1,2,3,4,5,6], '18:00', '21:00', 15, 400),
  ('dr-sneha-patil', 'Dr. Sneha Patil', 'Dermato-Cosmetologist', 'MBBS, DDVL', '12+ Years Experience', 'Derma & Skin Care', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400', ARRAY[1,2,3,4,5,6], '11:00', '13:00', 20, 450),
  ('dr-vikram-deshmukh', 'Dr. Vikram Deshmukh', 'Ortho-Physiotherapy Specialist', 'BPT, MPT (Orthopedics)', '20+ Years Experience', 'Ortho-Physiotherapy', 'https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=400', ARRAY[1,2,3,4,5,6], '15:00', '18:00', 20, 600)
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (icon, title, description) VALUES
  ('Stethoscope', 'Dental Healthcare', 'Comprehensive dental services including routine check-ups, cleanings, orthodontics, and advanced oral care.'),
  ('Heart', 'General Health Care', 'Expert general physician consultations for accurate diagnosis, chronic disease management, and standard treatments.'),
  ('Activity', 'Wellness & IV Therapy', 'Specialized intravenous wellness treatments tailored to boost immunity, hydration, and overall energy levels.'),
  ('Sparkles', 'Derma & Skin Care', 'Premium clinical skin and aesthetic care, including hydrafacials, chemical peels, and specialized therapies.'),
  ('Users', 'Ortho-Physiotherapy', 'Professional orthopedic physiotherapy and rehabilitation to restore movement, strength, and function.'),
  ('ClipboardCheck', 'Preventive Health Checkups', 'Regular health screenings and wellness programs to detect and prevent health issues early.'),
  ('Microscope', 'Diagnostic Services', 'In-house laboratory and diagnostic services for precise and timely healthcare reports.'),
  ('Home', 'Family Healthcare', 'Complete family healthcare solutions designed to cater to patients of all ages, from children to elders.')
ON CONFLICT DO NOTHING;

INSERT INTO facilities (title, description, image) VALUES
  ('Modern Dental Clinic', 'State-of-the-art dental chairs and modern oral diagnostic equipment.', 'https://kommodo.ai/i/4A0iw796mLF7g5xhBHUc'),
  ('Aesthetic & Skin Care Lounge', 'Premium space for hydrafacials, skin peels, and advanced aesthetic care.', 'https://kommodo.ai/i/QYja1HXYOq5ewE4cFqtN'),
  ('Wellness IV Infusion Bay', 'Relaxing lounge for specialized wellness, rehydration, and antioxidant IV treatments.', 'https://kommodo.ai/i/s7vYDCM4uDL41nNUAUpi'),
  ('General Consultation Suites', 'Comfortable private rooms for detailed physical consultations and checks.', 'https://kommodo.ai/i/b8Wnz2wQ1ckCLbKMW9r9'),
  ('Diagnostic Laboratory', 'In-house clinical diagnostic labs for accurate blood and sample testing.', 'https://kommodo.ai/i/3fpCCP3D8jj5cxE9z7Zu')
ON CONFLICT DO NOTHING;

INSERT INTO testimonials (name, location, rating, text, avatar) VALUES
  ('Priya Hegde', 'Bengaluru', 5, 'The dental treatment I received here was excellent. Highly professional doctors and extremely clean facilities.', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100'),
  ('Ramesh Patil', 'Bengaluru', 5, 'Professional general healthcare consultations with very supportive staff. The environment is hygienic and well-maintained.', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100'),
  ('Sunita Kulkarni', 'Bengaluru', 5, 'Loved their wellness and IV therapy session. It was highly rejuvenating, and the service was top-notch.', 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100'),
  ('Mahesh Deshmukh', 'Bengaluru', 5, 'Very attentive skin care and cosmetic team. The chemical peel and hydrafacial treatment had great results.', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100')
ON CONFLICT DO NOTHING;

INSERT INTO faqs (question, answer) VALUES
  ('Do I need an appointment before visiting?', 'While walk-ins are welcome for general consultations, we recommend booking or requesting a callback to minimize wait times and ensure specialist availability.'),
  ('What services are available?', 'We offer comprehensive dental care, general medicine consultations, wellness & IV therapy, dermato-cosmetology (skin care), ortho-physiotherapy, diagnostic services, and family healthcare.'),
  ('Are emergency services available?', 'Yes, Drona Healthcare Services provides emergency support during clinic hours. For urgent needs, please call our direct helpline number.'),
  ('Can I request a callback?', 'Absolutely! You can submit a callback request through our website. Our reception team will reach out to you within 24 hours to schedule your visit.'),
  ('What are the clinic timings?', 'Our clinic is open Monday to Saturday from 10:00 AM to 2:00 PM and 5:30 PM to 9:30 PM.')
ON CONFLICT DO NOTHING;

INSERT INTO hospital_settings (
  id, name, local_name, tagline, description,
  address_street, address_city, address_state, address_pincode,
  phone, email, emergency_phone, working_hours,
  map_url, map_embed_url, hero_image,
  social_facebook, social_instagram, social_twitter, social_linkedin
) VALUES (
  1, 'Drona Healthcare services', 'ದ್ರೋಣ ಹೆಲ್ತ್‌ಕೇರ್ ಸರ್ವಿಸಸ್', 'Trusted Dental and General Healthcare Services',
  'Serving the Bengaluru community with expert dental care, general medicine consultations, wellness therapies, and personalized treatment plans.',
  'First Floor, 273/15, 28, 1st Cross Rd, Vishwapriya Layout, Begur', 'Bengaluru', 'Karnataka', '560114',
  '+91 99864 92170', 'contact@dronahealthcare.in', '+91 99864 92170', '10:00 AM - 2:00 PM, 5:30 PM - 9:30 PM',
  'https://www.google.com/maps/place/Drona+Healthcare+services/@12.881848,77.6261325,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae154a09555d69:0x3a5b2a21fc7d25e0!8m2!3d12.881848!4d77.6287074!16s%2Fg%2F11v5k_c28c',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.2476569106093!2d77.62613247565985!3d12.881847997190013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae154a09555d69%3A0x3a5b2a21fc7d25e0!2sDrona%20Healthcare%20services!5e0!3m2!1sen!2sin!4v1718384400000!5m2!1sen!2sin',
  'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://facebook.com/dronahealthcare', 'https://instagram.com/dronahealthcare', 'https://twitter.com/dronahealthcare', 'https://linkedin.com/company/dronahealthcare'
)
ON CONFLICT (id) DO NOTHING;
