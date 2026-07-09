import { useState } from 'react';
import { X, User, Phone, Cake, Users, Ticket, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { genderOptions } from '../../data/bookingData';
import type { Token } from '../../types';

const TOKENS_STORAGE_KEY = 'tokens';

interface FormState {
  name: string;
  phone: string;
  age: string;
  gender: string;
}

const EMPTY_FORM: FormState = { name: '', phone: '', age: '', gender: '' };

interface BookTokenModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function BookTokenModal({ onClose, onSuccess }: BookTokenModalProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState<Token | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<FormState> = {};
    if (!form.name.trim()) newErrors.name = 'Please enter full name';
    if (!/^[0-9]{10}$/.test(form.phone.replace(/\D/g, ''))) newErrors.phone = 'Enter a valid 10-digit number';
    const ageNum = Number(form.age);
    if (!form.age || isNaN(ageNum) || ageNum <= 0 || ageNum > 120) newErrors.age = 'Enter a valid age';
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

  const handleDone = () => {
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl border border-border max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-bold text-heading flex items-center gap-2">
            <Ticket className="w-5 h-5 text-primary" />
            Book Token
          </h2>
          <button onClick={onClose} className="text-muted hover:text-heading transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {token ? (
            <div className="text-center">
              <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-secondary" />
              </div>
              <p className="text-muted mb-1">Token Issued</p>
              <p className="text-5xl font-bold text-primary mb-3">#{token.token_number}</p>
              <p className="font-semibold text-heading">{token.patient_name}</p>
              <p className="text-sm text-muted mb-6">{token.patient_phone}</p>
              <Button variant="primary" className="w-full" onClick={handleDone}>
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Patient's full name"
                    className={`w-full pl-11 pr-4 py-2.5 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-sm ${errors.name ? 'border-red-500' : 'border-border focus:border-primary'}`}
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-heading mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="10-digit mobile number"
                    className={`w-full pl-11 pr-4 py-2.5 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-sm ${errors.phone ? 'border-red-500' : 'border-border focus:border-primary'}`}
                  />
                </div>
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">Age</label>
                  <div className="relative">
                    <Cake className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={form.age}
                      onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))}
                      placeholder="Age"
                      className={`w-full pl-11 pr-4 py-2.5 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-sm ${errors.age ? 'border-red-500' : 'border-border focus:border-primary'}`}
                    />
                  </div>
                  {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-heading mb-1.5">Gender</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <select
                      value={form.gender}
                      onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
                      className={`w-full pl-11 pr-4 py-2.5 bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors appearance-none text-sm ${errors.gender ? 'border-red-500' : 'border-border focus:border-primary'}`}
                    >
                      <option value="">Select</option>
                      {genderOptions.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1" icon={<Ticket className="w-4 h-4" />} loading={submitting}>
                  Issue Token
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
