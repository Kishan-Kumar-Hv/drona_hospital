import { useState } from 'react';
import { User, Phone, Cake, Users, Ticket, CheckCircle2, AlertCircle } from 'lucide-react';
import { MinimalHeader } from '../components/layout/MinimalHeader';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { genderOptions } from '../data/bookingData';
import type { Token } from '../types';

const TOKENS_STORAGE_KEY = 'tokens';

interface FormState {
  name: string;
  phone: string;
  age: string;
  gender: string;
}

const EMPTY_FORM: FormState = { name: '', phone: '', age: '', gender: '' };

export function TokenBookingPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<{ name?: string; phone?: string; age?: string; gender?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState<Token | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!form.name.trim()) newErrors.name = 'Please enter your full name';
    if (!/^[0-9]{10}$/.test(form.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    const ageNum = Number(form.age);
    if (!form.age || isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      newErrors.age = 'Please enter a valid age';
    }
    if (!form.gender) newErrors.gender = 'Please select a gender';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    setError('');

    const phone = form.phone.replace(/\D/g, '');

    try {
      if (supabase) {
        const { data, error: rpcError } = await supabase.rpc('create_token', {
          p_name: form.name.trim(),
          p_phone: phone,
          p_age: ageNum,
          p_gender: form.gender,
        });
        if (rpcError) throw rpcError;
        const created = (data ?? [])[0] as Token | undefined;
        if (!created) throw new Error('Could not generate a token. Please try again.');
        setToken(created);
      } else {
        const stored: Token[] = JSON.parse(localStorage.getItem(TOKENS_STORAGE_KEY) || '[]');
        const nextNumber = stored.reduce((max, t) => Math.max(max, t.token_number), 0) + 1;
        const created: Token = {
          id: crypto.randomUUID(),
          token_number: nextNumber,
          patient_name: form.name.trim(),
          patient_phone: phone,
          patient_age: ageNum,
          patient_gender: form.gender,
          status: 'pending',
          created_at: new Date().toISOString(),
        };
        stored.push(created);
        localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(stored));
        setToken(created);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnother = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setError('');
    setToken(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MinimalHeader />

      <main className="flex-1 container-custom py-10 md:py-14">
        <div className="max-w-md mx-auto">
          {token ? (
            <div className="bg-white rounded-2xl border border-border p-8 text-center">
              <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-secondary" />
              </div>
              <p className="text-muted mb-2">Your Token Number</p>
              <p className="text-6xl font-bold text-primary mb-4">#{token.token_number}</p>
              <p className="font-semibold text-heading">{token.patient_name}</p>
              <p className="text-sm text-muted mb-6">{token.patient_phone}</p>
              <div className="bg-background rounded-xl p-4 text-sm text-body mb-6">
                Please show this token number at the reception desk when you visit. No
                appointment time is needed — you can visit any day during hospital hours.
              </div>
              <Button variant="outline" onClick={handleAnother} className="w-full">
                Book Another Token
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-heading">Book Your Token</h1>
              </div>
              <p className="text-muted mb-8">
                Get a queue token for your visit. No need to pick a date or time — just walk in
                with your token number.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-heading mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type="text"
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      className={`w-full pl-12 pr-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${
                        errors.name ? 'border-red-500' : 'border-border focus:border-primary'
                      }`}
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-heading mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <input
                      type="tel"
                      id="phone"
                      value={form.phone}
                      onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="10-digit mobile number"
                      className={`w-full pl-12 pr-4 py-3 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${
                        errors.phone ? 'border-red-500' : 'border-border focus:border-primary'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>

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
                        value={form.age}
                        onChange={(e) => setForm((prev) => ({ ...prev, age: e.target.value }))}
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
                        value={form.gender}
                        onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value }))}
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

                {error && (
                  <div className="p-4 bg-red-50 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                  </div>
                )}

                <Button type="submit" variant="primary" size="lg" loading={submitting} icon={<Ticket className="w-5 h-5" />} className="w-full">
                  Get My Token
                </Button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
