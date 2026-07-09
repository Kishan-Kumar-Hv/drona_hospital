import type { Doctor, Service, Facility, Testimonial, Faq, HospitalSettings } from '../types';

// Fallback content used when Supabase isn't configured, or as the initial
// seed reference for the `content_management` migration. Mirrors the rows
// inserted by supabase/migrations/20260616000000_content_management.sql.

export const FALLBACK_DOCTORS: Doctor[] = [
  {
    id: 'dr-anjali-sharma',
    name: 'Dr. Anjali Sharma',
    specialty: 'Senior Consultant Dentist',
    qualifications: 'BDS, MDS (Orthodontics)',
    experience: '18+ Years Experience',
    department: 'Dentistry',
    image: 'https://images.pexels.com/photos/545229/pexels-photo-545229.jpeg?auto=compress&cs=tinysrgb&w=400',
    workingDays: [1, 2, 3, 4, 5, 6],
    startTime: '10:00',
    endTime: '14:00',
    slotMinutes: 20,
    consultationFee: 500,
  },
  {
    id: 'dr-rajesh-kulkarni',
    name: 'Dr. Rajesh Kulkarni',
    specialty: 'Consultant General Physician',
    qualifications: 'MBBS, MD (General Medicine)',
    experience: '15+ Years Experience',
    department: 'General Medicine',
    image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
    workingDays: [1, 2, 3, 4, 5, 6],
    startTime: '18:00',
    endTime: '21:00',
    slotMinutes: 15,
    consultationFee: 400,
  },
  {
    id: 'dr-sneha-patil',
    name: 'Dr. Sneha Patil',
    specialty: 'Dermato-Cosmetologist',
    qualifications: 'MBBS, DDVL',
    experience: '12+ Years Experience',
    department: 'Derma & Skin Care',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    workingDays: [1, 2, 3, 4, 5, 6],
    startTime: '11:00',
    endTime: '13:00',
    slotMinutes: 20,
    consultationFee: 450,
  },
  {
    id: 'dr-vikram-deshmukh',
    name: 'Dr. Vikram Deshmukh',
    specialty: 'Ortho-Physiotherapy Specialist',
    qualifications: 'BPT, MPT (Orthopedics)',
    experience: '20+ Years Experience',
    department: 'Ortho-Physiotherapy',
    image: 'https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=400',
    workingDays: [1, 2, 3, 4, 5, 6],
    startTime: '15:00',
    endTime: '18:00',
    slotMinutes: 20,
    consultationFee: 600,
  },
];

export const FALLBACK_SERVICES: Service[] = [
  {
    id: 'dental',
    icon: 'Sparkles',
    title: 'Dental Care',
    description: 'Comprehensive dental services including routine check-ups, root canals, cleanings, braces, and advanced oral care.',
  },
  {
    id: 'skin',
    icon: 'Sparkles',
    title: 'Skin & Aesthetic Care',
    description: 'Advanced skin treatments, PRP hair therapy, Hydrafacials, carbon peeling, and professional dermatological reviews.',
  },
  {
    id: 'orthopedics',
    icon: 'Activity',
    title: 'Orthopedics & Physiotherapy',
    description: 'Professional orthopedic physiotherapy, back/neck pain therapy, posture correction, and rehabilitation.',
  },
  {
    id: 'general-healthcare',
    icon: 'Stethoscope',
    title: 'General Healthcare',
    description: 'Expert physician consultations for accurate diagnosis, chronic disease management, and standard medical checkups.',
  },
  {
    id: 'gynecology',
    icon: 'Heart',
    title: 'Gynecology & Women\'s Health',
    description: 'Comprehensive women\'s health checks, maternal wellness, PCOS care, and personal consultation.',
  },
  {
    id: 'psychology',
    icon: 'Users',
    title: 'Psychology Counselling',
    description: 'Professional counseling and support for stress management, anxiety, depression, and mental wellness.',
  },
];

export const FALLBACK_FACILITIES: Facility[] = [
  {
    id: 'fallback-facility-1',
    title: 'Modern Dental Clinic',
    description: 'State-of-the-art dental chairs and modern oral diagnostic equipment.',
    image: 'https://plain-apac-prod-public.komododecks.com/202607/09/4A0iw796mLF7g5xhBHUc/image.png',
  },
  {
    id: 'fallback-facility-2',
    title: 'Aesthetic & Skin Care Lounge',
    description: 'Premium space for hydrafacials, skin peels, and advanced aesthetic care.',
    image: 'https://plain-apac-prod-public.komododecks.com/202607/09/QYja1HXYOq5ewE4cFqtN/image.png',
  },
  {
    id: 'fallback-facility-3',
    title: 'Wellness IV Infusion Bay',
    description: 'Relaxing lounge for specialized wellness, rehydration, and antioxidant IV treatments.',
    image: 'https://plain-apac-prod-public.komododecks.com/202607/09/s7vYDCM4uDL41nNUAUpi/image.png',
  },
  {
    id: 'fallback-facility-4',
    title: 'General Consultation Suites',
    description: 'Comfortable private rooms for detailed physical consultations and checks.',
    image: 'https://plain-apac-prod-public.komododecks.com/202607/09/b8Wnz2wQ1ckCLbKMW9r9/image.png',
  },
  {
    id: 'fallback-facility-5',
    title: 'Diagnostic Laboratory',
    description: 'In-house clinical diagnostic labs for accurate blood and sample testing.',
    image: 'https://plain-apac-prod-public.komododecks.com/202607/09/3fpCCP3D8jj5cxE9z7Zu/image.png',
  },
];

export const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 'fallback-testimonial-1',
    name: 'Priya Hegde',
    location: 'Bengaluru',
    rating: 5,
    text: 'The dental treatment I received here was excellent. Highly professional doctors and extremely clean facilities.',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: 'fallback-testimonial-2',
    name: 'Ramesh Patil',
    location: 'Bengaluru',
    rating: 5,
    text: 'Professional general healthcare consultations with very supportive staff. The environment is hygienic and well-maintained.',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: 'fallback-testimonial-3',
    name: 'Sunita Kulkarni',
    location: 'Bengaluru',
    rating: 5,
    text: 'Loved their wellness and IV therapy session. It was highly rejuvenating, and the service was top-notch.',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
  {
    id: 'fallback-testimonial-4',
    name: 'Mahesh Deshmukh',
    location: 'Bengaluru',
    rating: 5,
    text: 'Very attentive skin care and cosmetic team. The chemical peel and hydrafacial treatment had great results.',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
  },
];

export const FALLBACK_FAQS: Faq[] = [
  {
    id: 'fallback-faq-1',
    question: 'Do I need an appointment before visiting?',
    answer: 'While walk-ins are welcome for general consultations, we recommend booking or requesting a callback to minimize wait times and ensure specialist availability.',
  },
  {
    id: 'fallback-faq-2',
    question: 'What services are available?',
    answer: 'We offer comprehensive dental care, general medicine consultations, wellness & IV therapy, dermato-cosmetology (skin care), ortho-physiotherapy, diagnostic services, and family healthcare.',
  },
  {
    id: 'fallback-faq-3',
    question: 'Are emergency services available?',
    answer: 'Yes, Drona Healthcare Services provides emergency support during clinic hours. For urgent needs, please call our direct helpline number.',
  },
  {
    id: 'fallback-faq-4',
    question: 'Can I request a callback?',
    answer: 'Absolutely! You can submit a callback request through our website. Our reception team will reach out to you within 24 hours to schedule your visit.',
  },
  {
    id: 'fallback-faq-5',
    question: 'What are the clinic timings?',
    answer: 'Our clinic is open Monday to Saturday from 10:00 AM to 2:00 PM and 5:30 PM to 9:30 PM.',
  },
];

export const FALLBACK_HOSPITAL_SETTINGS: HospitalSettings = {
  id: 1,
  name: 'Drona Healthcare services',
  local_name: 'ದ್ರೋಣ ಹೆಲ್ತ್‌ಕೇರ್ ಸರ್ವಿಸಸ್',
  tagline: 'Trusted Dental and General Healthcare Services',
  description: 'Serving the Bengaluru community with expert dental care, general medicine consultations, wellness therapies, and personalized treatment plans.',
  address_street: 'First Floor, 273/15, 28, 1st Cross Rd, Vishwapriya Layout, Begur',
  address_city: 'Bengaluru',
  address_state: 'Karnataka',
  address_pincode: '560114',
  phone: '+91 99864 92170',
  email: 'contact@dronahealthcare.in',
  emergency_phone: '+91 99864 92170',
  working_hours: '10:00 AM - 2:00 PM, 5:30 PM - 9:30 PM',
  map_url: 'https://www.google.com/maps/place/Drona+Healthcare+services/@12.881848,77.6261325,17z/data=!3m1!4b1!4m6!3m5!1s0x3bae154a09555d69:0x3a5b2a21fc7d25e0!8m2!3d12.881848!4d77.6287074!16s%2Fg%2F11v5k_c28c',
  map_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.2476569106093!2d77.62613247565985!3d12.881847997190013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae154a09555d69%3A0x3a5b2a21fc7d25e0!2sDrona%20Healthcare%20services!5e0!3m2!1sen!2sin!4v1718384400000!5m2!1sen!2sin',
  hero_image: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=1200',
  social_facebook: 'https://facebook.com/dronahealthcare',
  social_instagram: 'https://instagram.com/dronahealthcare',
  social_twitter: 'https://twitter.com/dronahealthcare',
  social_linkedin: 'https://linkedin.com/company/dronahealthcare',
};
