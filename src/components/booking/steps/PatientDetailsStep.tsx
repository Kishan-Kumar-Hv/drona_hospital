import { useState } from 'react';
import { ArrowRight, ArrowLeft, Mail, Cake, Users, FileText } from 'lucide-react';
import { Button } from '../../ui/Button';
import { genderOptions } from '../../../data/bookingData';
import type { BookingDraft } from '../../../types';

interface PatientDetailsStepProps {
  draft: BookingDraft;
  onContinue: (details: Pick<BookingDraft, 'patientEmail' | 'patientAge' | 'patientGender' | 'reason'>) => void;
  onBack: () => void;
}

export function PatientDetailsStep({ draft, onContinue, onBack }: PatientDetailsStepProps) {
  const [email, setEmail] = useState(draft.patientEmail);
  const [age, setAge] = useState(draft.patientAge);
  const [gender, setGender] = useState(draft.patientGender);
  const [reason, setReason] = useState(draft.reason);
  const [errors, setErrors] = useState<{ age?: string; gender?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { age?: string; gender?: string } = {};
    const ageNum = Number(age);
    if (!age || isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      newErrors.age = 'Please enter a valid age';
    }
    if (!gender) newErrors.gender = 'Please select a gender';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onContinue({ patientEmail: email.trim(), patientAge: age, patientGender: gender, reason: reason.trim() });
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-heading mb-2">Visit Details</h2>
      <p className="text-muted mb-8">
        A few more details to help the doctor prepare for your visit.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-heading mb-2">
              Age
            </label>
            <div className="relative">
              <Cake className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="number"
                id="age"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age"
                className={`w-full pl-12 pr-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${
                  errors.age ? 'border-red-500' : 'border-border focus:border-primary'
                }`}
              />
            </div>
            {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age}</p>}
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-heading mb-2">
              Gender
            </label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors appearance-none ${
                  errors.gender ? 'border-red-500' : 'border-border focus:border-primary'
                }`}
              >
                <option value="">Select</option>
                {genderOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-heading mb-2">
            Email (optional)
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-heading mb-2">
            Reason for Visit (optional)
          </label>
          <div className="relative">
            <FileText className="absolute left-4 top-3 w-5 h-5 text-muted" />
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe your symptoms or reason for the visit"
              rows={3}
              className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" size="lg" icon={<ArrowLeft className="w-5 h-5" />} onClick={onBack}>
            Back
          </Button>
          <Button type="submit" variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}
