import { useState } from 'react';
import { User, Phone, ArrowRight } from 'lucide-react';
import { Button } from '../../ui/Button';
import type { PatientIdentity } from '../../../types';

interface PatientIdentityStepProps {
  identity: PatientIdentity;
  onContinue: (identity: PatientIdentity) => void;
}

export function PatientIdentityStep({ identity, onContinue }: PatientIdentityStepProps) {
  const [fullName, setFullName] = useState(identity.fullName);
  const [phoneNumber, setPhoneNumber] = useState(identity.phoneNumber);
  const [errors, setErrors] = useState<{ fullName?: string; phoneNumber?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { fullName?: string; phoneNumber?: string } = {};
    if (!fullName.trim()) newErrors.fullName = 'Please enter your full name';
    if (!/^[0-9]{10}$/.test(phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onContinue({ fullName: fullName.trim(), phoneNumber: phoneNumber.replace(/\D/g, '') });
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-heading mb-2">
        Let's get started
      </h2>
      <p className="text-muted mb-8">
        Enter your name and phone number. We'll use this to confirm your appointment and let
        you manage your bookings later.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-heading mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className={`w-full pl-12 pr-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${
                errors.fullName ? 'border-red-500' : 'border-border focus:border-primary'
              }`}
            />
          </div>
          {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-heading mb-2">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="10-digit mobile number"
              className={`w-full pl-12 pr-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${
                errors.phoneNumber ? 'border-red-500' : 'border-border focus:border-primary'
              }`}
            />
          </div>
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
          )}
          <p className="mt-2 text-sm text-muted">
            We'll use this number to send your appointment confirmation and to look up your
            bookings under "My Appointments".
          </p>
        </div>

        <Button type="submit" variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
          Continue
        </Button>
      </form>
    </div>
  );
}
