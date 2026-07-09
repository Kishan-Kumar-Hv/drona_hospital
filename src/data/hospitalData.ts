import { Stethoscope, Activity, Users, ClipboardCheck, Clock, Award, Sparkles, UserCheck } from 'lucide-react';

// Navigation Links
export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Doctors', href: '#doctors' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Health Insights', href: '#blog' },
  { label: 'Contact', href: '#contact' },
  { label: 'Admin Portal', href: '/reception/login' },
];

// Trust Statistics
export const trustStats = [
  {
    value: 15,
    suffix: '+',
    label: 'Years of Trusted Care',
  },
  {
    value: 25000,
    suffix: '+',
    label: 'Patients Served',
  },
  {
    value: 20,
    suffix: '+',
    label: 'Healthcare Professionals',
  },
  {
    value: 4.0,
    suffix: '★',
    label: 'Patient Rating',
  },
];

// Why Choose Us Features
export const whyChooseUs = [
  {
    icon: Award,
    title: 'Experienced Specialists',
    description:
      'Our team of highly qualified doctors brings decades of combined experience in their respective fields.',
  },
  {
    icon: Sparkles,
    title: 'Modern Facilities',
    description:
      'State-of-the-art medical equipment and comfortable, hygienic environment for the best patient experience.',
  },
  {
    icon: Clock,
    title: 'Fast Appointments',
    description:
      'Quick scheduling process with minimal wait times, because your health should never wait.',
  },
  {
    icon: UserCheck,
    title: 'Patient-Centered Care',
    description:
      'Every treatment plan is tailored to your unique needs, ensuring personalized attention and care.',
  },
];

// Patient Journey Steps
export const patientJourney = [
  {
    step: 1,
    title: 'Choose Service',
    description: 'Select the healthcare service you need from our comprehensive offerings.',
    icon: ClipboardCheck,
  },
  {
    step: 2,
    title: 'Select Doctor',
    description: 'Choose from our team of experienced specialists based on your needs.',
    icon: Users,
  },
  {
    step: 3,
    title: 'Confirm timing',
    description: 'Request a callback online or call our clinic directly to confirm your timing.',
    icon: Stethoscope,
  },
  {
    step: 4,
    title: 'Visit Clinic',
    description: 'Arrive at the hospital and receive quality healthcare from our team.',
    icon: Activity,
  },
];

// Preferred callback times
export const preferredTimes = [
  'Morning (9 AM - 12 PM)',
  'Afternoon (12 PM - 4 PM)',
  'Evening (4 PM - 8 PM)',
];
