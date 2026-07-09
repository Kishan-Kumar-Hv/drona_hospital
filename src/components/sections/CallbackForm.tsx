import { useState, useEffect, useMemo } from 'react';
import { Phone, User, Building2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { preferredTimes } from '../../data/hospitalData';
import { supabase } from '../../lib/supabase';
import { Section, SectionHeader } from '../ui/Section';
import { Button } from '../ui/Button';
import { useInView } from '../../hooks/useAnimation';
import { useBooking } from '../../hooks/useBooking';
import { useDoctors } from '../../hooks/useContent';

interface FormData {
  fullName: string;
  phoneNumber: string;
  department: string;
  preferredTime: string;
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export function CallbackForm() {
  const { ref, isInView } = useInView(0.1);
  const { bookingData, clearBookingData } = useBooking();
  const { data: doctors } = useDoctors();
  const departments = useMemo(
    () => Array.from(new Set(doctors.map((d) => d.department))),
    [doctors]
  );
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phoneNumber: '',
    department: '',
    preferredTime: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Pre-fill department and preferred time from booking context
  useEffect(() => {
    if (bookingData.department || bookingData.preferredTime) {
      setFormData((prev) => ({
        ...prev,
        department: bookingData.department || prev.department,
        preferredTime: bookingData.preferredTime || prev.preferredTime,
      }));
    }
  }, [bookingData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your name';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Please enter your phone number';
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.department) {
      newErrors.department = 'Please select a department';
    }

    if (!formData.preferredTime) {
      newErrors.preferredTime = 'Please select a preferred time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setStatus('loading');

    try {
      // Store in Supabase if available, otherwise store in localStorage
      if (supabase) {
        const { error } = await supabase.from('callback_requests').insert([
          {
            full_name: formData.fullName,
            phone_number: formData.phoneNumber,
            department: formData.department,
            preferred_time: formData.preferredTime,
            created_at: new Date().toISOString(),
          },
        ]);

        if (error) throw error;
      } else {
        // Fallback to localStorage
        const requests = JSON.parse(
          localStorage.getItem('callback_requests') || '[]'
        );
        requests.push({
          ...formData,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('callback_requests', JSON.stringify(requests));
      }

      setStatus('success');
      setFormData({
        fullName: '',
        phoneNumber: '',
        department: '',
        preferredTime: '',
      });
      clearBookingData();

      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <Section id="callback" background="white">
      <div
        ref={ref}
        className={`max-w-4xl mx-auto transition-all duration-700 ${
          isInView
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-8'
        }`}
      >
        <SectionHeader
          title="Request a Callback"
          subtitle="Not ready to book? Share your details and our team will call you back at your convenience."
        />

        <div className="bg-white rounded-2xl shadow-lg border border-border p-8 md:p-12">
          {status === 'success' && (
            <div className="mb-8 p-4 bg-secondary/10 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-secondary" />
              <p className="text-secondary font-medium">
                Thank you! We will call you back within 24 hours.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="mb-8 p-4 bg-red-50 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-600 font-medium">
                Something went wrong. Please try again or call us directly.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-heading mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full pl-12 pr-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${
                      errors.fullName
                        ? 'border-red-500'
                        : 'border-border focus:border-primary'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-heading mb-2"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className={`w-full pl-12 pr-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${
                      errors.phoneNumber
                        ? 'border-red-500'
                        : 'border-border focus:border-primary'
                    }`}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Department */}
              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-heading mb-2"
                >
                  Preferred Department
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors appearance-none ${
                      errors.department
                        ? 'border-red-500'
                        : 'border-border focus:border-primary'
                    }`}
                  >
                    <option value="">Select a department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-muted"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-500">{errors.department}</p>
                )}
              </div>

              {/* Preferred Time */}
              <div>
                <label
                  htmlFor="preferredTime"
                  className="block text-sm font-medium text-heading mb-2"
                >
                  Preferred Callback Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors appearance-none ${
                      errors.preferredTime
                        ? 'border-red-500'
                        : 'border-border focus:border-primary'
                    }`}
                  >
                    <option value="">Select a time slot</option>
                    {preferredTimes.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-muted"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {errors.preferredTime && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.preferredTime}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full md:w-auto"
              loading={status === 'loading'}
              icon={<Phone className="w-5 h-5" />}
            >
              Request Callback
            </Button>
          </form>
        </div>
      </div>
    </Section>
  );
}
