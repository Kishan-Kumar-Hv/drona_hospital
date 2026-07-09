import { useParams, Link } from 'react-router-dom';
import { MinimalHeader } from '../components/layout/MinimalHeader';
import { Footer } from '../components/sections/Footer';
import { FALLBACK_SERVICES } from '../data/fallbackContent';
import { ICON_MAP, DEFAULT_ICON } from '../lib/iconMap';
import { CheckCircle, Clock, AlertCircle, Phone, ArrowLeft } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';

interface ServiceDetailData {
  title: string;
  subtitle: string;
  treatments: string[];
  symptoms: string[];
  faqs: { q: string; a: string }[];
  recoveryText: string;
}

const SERVICE_DETAILS: Record<string, ServiceDetailData> = {
  'fallback-service-1': {
    title: 'Dental Healthcare',
    subtitle: 'Advanced orthodontic, cosmetic, and general dentistry solutions.',
    treatments: [
      'Root Canal Treatment (RCT) - Painless Single Sitting',
      'Orthodontic Braces and Invisible Aligners',
      'Cosmetic Dentistry and Smile Designing',
      'Teeth Whitening and Bleaching',
      'Dental Implants and Crown Fixings',
      'Scaling, Polishing, and Deep Cleaning'
    ],
    symptoms: [
      'Toothache or persistent throbbing pain',
      'Bleeding or swollen gums during brushing',
      'Sensitivity to hot or cold foods',
      'Bad breath or unpleasant taste in the mouth',
      'Crooked, misaligned, or crowded teeth'
    ],
    faqs: [
      { q: 'How often should I visit for a dental check-up?', a: 'We recommend a dental visit every 6 months for a professional cleaning and examination to prevent plaque buildup and detect early signs of decay.' },
      { q: 'Are dental implants painful?', a: 'Implants are placed under local anesthesia, so you will not feel pain during the procedure. Post-operative discomfort is minor and manageable with standard medications.' },
      { q: 'What is the duration of aligner treatments?', a: 'It varies from 6 to 18 months depending on the complexity of alignment required. Our specialist will design a custom digital treatment timeline for you.' }
    ],
    recoveryText: 'For dental procedures, normal eating can usually be resumed within a few hours (once numbness wears off). Full recovery for implants or surgical extractions takes 3 to 7 days.'
  },
  'fallback-service-2': {
    title: 'General Health Care',
    subtitle: 'Primary consultations, chronic disease management, and preventative advice.',
    treatments: [
      'General Physician Consultations',
      'Management of Hypertension & Blood Pressure',
      'Diabetes Control & Glucose Management',
      'Treatment of Seasonal Fevers, Infections & Flu',
      'Cardiovascular Health Screening & ECG Assessment',
      'Chronic Pain Management Plans'
    ],
    symptoms: [
      'Persistent fever, body aches, or sore throat',
      'Fluctuations in blood pressure or heart rate',
      'Unexplained fatigue or sudden weight changes',
      'Frequent thirst or urination (diabetes indicators)',
      'Chronic joint or muscle discomfort'
    ],
    faqs: [
      { q: 'When should I seek consultation for general fever?', a: 'If a fever exceeds 101°F (38.3°C) or lasts more than 3 consecutive days, it is recommended to get a physician consultation and blood diagnostic test.' },
      { q: 'Do you offer chronic disease packages?', a: 'Yes, we provide personalized, ongoing monthly management plans for diabetes, hypertension, and thyroid conditions.' }
    ],
    recoveryText: 'General health recovery times vary by condition. Standard bacterial or viral infections typically resolve within 5 to 7 days with correct medication and rest.'
  },
  'fallback-service-3': {
    title: 'Wellness & IV Therapy',
    subtitle: 'Direct nutrient and hydration infusions to boost wellness, energy, and immunity.',
    treatments: [
      'Myer\'s Cocktail Classic Wellness IV',
      'Immunity Booster IV (High-dose Vitamin C & Zinc)',
      'Glutathione Skin Glow and Detox Infusions',
      'Hydration Recovery IV (Electrolytes & Saline)',
      'Anti-aging and Hair Growth Nutrient Drips',
      'Post-workout Muscle Recovery Formulation'
    ],
    symptoms: [
      'Chronic fatigue, low energy levels, or burnout',
      'Frequent seasonal colds or weak immune health',
      'Dull skin, dark spots, or hair thinning',
      'Dehydration due to heat, travel, or intense workouts',
      'Slow post-exercise recovery or muscle stiffness'
    ],
    faqs: [
      { q: 'How long does a typical IV session take?', a: 'Most wellness IV drips take between 30 to 45 minutes. You can relax, read, or work in our comfortable lounge during the procedure.' },
      { q: 'How quickly will I feel the results?', a: 'Because IV bypasses digestion, many patients report feeling refreshed, re-energized, and fully hydrated within a few hours of completion.' },
      { q: 'Is wellness IV therapy safe?', a: 'Yes. All IVs are customized and administered by registered clinical staff under the direct supervision of general physicians.' }
    ],
    recoveryText: 'There is zero downtime associated with wellness IV therapy. You can immediately return to your normal daily activities right after your session.'
  },
  'fallback-service-4': {
    title: 'Derma & Skin Care',
    subtitle: 'Clinical dermatology and aesthetic treatments for healthy, radiant skin.',
    treatments: [
      'Hydrafacial Skin Detox & Radiant Glow',
      'Chemical Peels for Pigmentation & Acne Control',
      'Acne and Acne Scar Removal Therapies',
      'Anti-aging Treatment (Wrinkle and Fine Line Reductions)',
      'Laser Hair Removal & Skin Toning',
      'Treatment of Eczema, Psoriasis & General Allergies'
    ],
    symptoms: [
      'Chronic acne, blackheads, or clogged skin pores',
      'Hyperpigmentation, dark spots, or sun damage',
      'Fine lines, wrinkles, or loss of skin elasticity',
      'Persistent dry, itchy, or peeling skin patches',
      'General skin redness or cosmetic allergies'
    ],
    faqs: [
      { q: 'What is the benefit of a Hydrafacial?', a: 'It provides deep cleansing, extraction of blackheads, gentle exfoliation, and intense serum hydration simultaneously, showing an immediate glow with zero redness.' },
      { q: 'Are chemical peels safe?', a: 'Yes. Our clinical-grade chemical peels are precisely matched to your skin type to ensure safe, controlled exfoliation and quick skin turnover.' }
    ],
    recoveryText: 'Hydrafacials have no recovery downtime. Standard chemical peels or acne therapies may cause light skin flaking for 2 to 5 days, during which sunscreen application is vital.'
  }
};

export function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>();

  // Find base service from FALLBACK_SERVICES
  const baseService = useMemo(() => {
    return FALLBACK_SERVICES.find((s) => s.id === serviceId);
  }, [serviceId]);

  // Find extra details (or fallback to defaults)
  const details = useMemo<ServiceDetailData>(() => {
    if (serviceId && SERVICE_DETAILS[serviceId]) {
      return SERVICE_DETAILS[serviceId];
    }
    return {
      title: baseService?.title ?? 'Medical Service',
      subtitle: baseService?.description ?? 'High-quality medical care at Drona Healthcare Services.',
      treatments: [
        'Specialized Physician Consultation',
        'Advanced Diagnostic Assessments',
        'Customized Treatment Formulation',
        'Follow-up Care and Monitoring'
      ],
      symptoms: [
        'Persistent symptoms impacting comfort',
        'Recommendation from a primary care doctor',
        'Routine health evaluation needs'
      ],
      faqs: [
        { q: 'Do I need a prior appointment?', a: 'We recommend requesting a callback or calling us in advance to ensure our specialist is available when you arrive.' }
      ],
      recoveryText: 'Timelines vary by treatment. Our medical team will guide you on recovery, medications, and follow-up schedules.'
    };
  }, [serviceId, baseService]);

  // Callback form state
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    preferredTime: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Please enter your name';
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Please enter your phone number';
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.preferredTime) newErrors.preferredTime = 'Please select a time';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus('loading');

    try {
      if (supabase) {
        const { error } = await supabase.from('callback_requests').insert([
          {
            full_name: formData.fullName,
            phone_number: formData.phoneNumber,
            department: details.title,
            preferred_time: formData.preferredTime,
            created_at: new Date().toISOString()
          }
        ]);
        if (error) throw error;
      } else {
        const requests = JSON.parse(localStorage.getItem('callback_requests') || '[]');
        requests.push({
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          department: details.title,
          preferredTime: formData.preferredTime,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('callback_requests', JSON.stringify(requests));
      }

      setStatus('success');
      setFormData({ fullName: '', phoneNumber: '', preferredTime: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  if (!baseService) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <MinimalHeader />
        <main className="container-custom py-20 text-center">
          <h2 className="text-3xl font-bold text-heading mb-4">Service Not Found</h2>
          <p className="text-muted mb-8">The service you are looking for does not exist or has been moved.</p>
          <Link to="/">
            <Button variant="primary">Return Home</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const Icon = ICON_MAP[baseService.icon] ?? DEFAULT_ICON;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background">
      <MinimalHeader backLabel="Back to Clinic Website" />

      <main className="flex-grow pt-8 pb-16">
        {/* Banner Section */}
        <div className="bg-white border-b border-border py-12 mb-12">
          <div className="container-custom">
            <Link to="/" className="inline-flex items-center text-sm text-primary hover:underline mb-6">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Home
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">Service Details</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-heading mb-3">{details.title}</h1>
            <p className="text-lg text-muted max-w-3xl leading-relaxed">{details.subtitle}</p>
          </div>
        </div>

        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Treatments Panel */}
              <div className="bg-white rounded-2xl border border-border p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-heading mb-6 flex items-center">
                  <CheckCircle className="w-6 h-6 text-secondary mr-2" /> Key Treatments & Services
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {details.treatments.map((treatment, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-background rounded-xl border border-border/50">
                      <span className="w-2.5 h-2.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                      <span className="text-body font-medium text-sm leading-relaxed">{treatment}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Symptoms Panel */}
              <div className="bg-white rounded-2xl border border-border p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-heading mb-4">Common Symptoms Treated</h2>
                <p className="text-muted mb-6">Consider consulting our specialists if you are experiencing any of these issues:</p>
                <ul className="space-y-3.5">
                  {details.symptoms.map((symptom, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-body">
                      <span className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="font-medium text-sm leading-relaxed">{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recovery Guidelines */}
              <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6 md:p-8">
                <h3 className="text-lg font-bold text-primary mb-2 flex items-center">
                  <Clock className="w-5 h-5 mr-2" /> Care & Recovery Guidance
                </h3>
                <p className="text-body leading-relaxed text-sm font-medium">{details.recoveryText}</p>
              </div>

              {/* FAQ Accordion */}
              <div className="bg-white rounded-2xl border border-border p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-heading mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {details.faqs.map((faq, idx) => (
                    <div key={idx} className="border-b border-border/60 pb-4 last:border-0 last:pb-0">
                      <h4 className="font-bold text-heading mb-2 text-sm md:text-base">Q: {faq.q}</h4>
                      <p className="text-muted text-sm leading-relaxed">A: {faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl border border-border p-6 md:p-8 shadow-md">
                <h3 className="text-xl font-bold text-heading mb-2">Request callback</h3>
                <p className="text-xs text-muted mb-6">Share your number and our department coordinator will contact you.</p>

                {status === 'success' && (
                  <div className="mb-6 p-3 bg-secondary/10 rounded-xl flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                    <p className="text-xs text-secondary font-semibold">Thank you! We will call you within 24 hours.</p>
                  </div>
                )}

                {status === 'error' && (
                  <div className="mb-6 p-3 bg-red-50 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <p className="text-xs text-red-600 font-semibold">Something went wrong. Please try again.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-semibold text-heading mb-1.5">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, fullName: e.target.value }));
                        if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
                      }}
                      placeholder="Your Name"
                      className={`w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        errors.fullName ? 'border-red-500' : 'border-border focus:border-primary'
                      }`}
                    />
                    {errors.fullName && <p className="text-xxs text-red-500 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-xs font-semibold text-heading mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, phoneNumber: e.target.value }));
                        if (errors.phoneNumber) setErrors(prev => ({ ...prev, phoneNumber: '' }));
                      }}
                      placeholder="10-digit number"
                      className={`w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        errors.phoneNumber ? 'border-red-500' : 'border-border focus:border-primary'
                      }`}
                    />
                    {errors.phoneNumber && <p className="text-xxs text-red-500 mt-1">{errors.phoneNumber}</p>}
                  </div>

                  <div>
                    <label htmlFor="preferredTime" className="block text-xs font-semibold text-heading mb-1.5">Preferred Time</label>
                    <select
                      id="preferredTime"
                      value={formData.preferredTime}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, preferredTime: e.target.value }));
                        if (errors.preferredTime) setErrors(prev => ({ ...prev, preferredTime: '' }));
                      }}
                      className={`w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none ${
                        errors.preferredTime ? 'border-red-500' : 'border-border focus:border-primary'
                      }`}
                    >
                      <option value="">Select a slot</option>
                      <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                      <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                      <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                    </select>
                    {errors.preferredTime && <p className="text-xxs text-red-500 mt-1">{errors.preferredTime}</p>}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    loading={status === 'loading'}
                    className="w-full text-sm font-semibold justify-center py-2"
                  >
                    Send Request
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-border/60 text-center">
                  <p className="text-xxs text-muted mb-2">Need immediate assistance?</p>
                  <a href="tel:+919986492170" className="inline-flex items-center gap-1.5 font-bold text-sm text-primary hover:underline">
                    <Phone className="w-4 h-4" /> +91 99864 92170
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
