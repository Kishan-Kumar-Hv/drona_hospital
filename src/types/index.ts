import type { LucideIcon } from 'lucide-react';

export interface NavLink {
  label: string;
  href: string;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
}

// Doctor: unified display info + booking schedule. workingDays: 0=Sun..6=Sat,
// startTime/endTime in 24h "HH:mm" format, slotMinutes = duration of each slot.
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualifications: string;
  experience: string;
  department: string;
  image: string;
  workingDays: number[];
  startTime: string;
  endTime: string;
  slotMinutes: number;
  consultationFee: number;
}

export interface Facility {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface JourneyStep {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface HospitalSettings {
  id: number;
  name: string;
  local_name: string;
  tagline: string;
  description: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_pincode: string;
  phone: string;
  email: string;
  emergency_phone: string;
  working_hours: string;
  map_url: string;
  map_embed_url: string;
  hero_image: string;
  social_facebook: string;
  social_instagram: string;
  social_twitter: string;
  social_linkedin: string;
}

export interface CallbackFormData {
  fullName: string;
  phoneNumber: string;
  department: string;
  preferredTime: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  booking_reference: string;
  patient_name: string;
  patient_phone: string;
  patient_email: string | null;
  patient_age: number | null;
  patient_gender: string | null;
  doctor_id: string;
  doctor_name: string;
  department: string;
  appointment_date: string;
  appointment_time: string;
  reason: string | null;
  status: AppointmentStatus;
  notes: string | null;
  created_at: string;
}

export interface PatientIdentity {
  fullName: string;
  phoneNumber: string;
}

export interface BookingDraft {
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAge: string;
  patientGender: string;
  reason: string;
}

export type TokenStatus = 'pending' | 'completed';

export interface Token {
  id: string;
  token_number: number;
  patient_name: string;
  patient_phone: string;
  patient_age: number | null;
  patient_gender: string | null;
  status: TokenStatus;
  created_at: string;
}
