import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Search,
  CalendarCheck,
  Stethoscope,
  Clock,
  AlertCircle,
  XCircle,
  Loader2,
  Ticket,
} from 'lucide-react';
import { MinimalHeader } from '../components/layout/MinimalHeader';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { formatDateLabel, formatTimeLabel } from '../data/bookingData';
import type { Appointment, Token } from '../types';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-secondary/10 text-secondary',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

const TOKEN_STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  completed: 'bg-secondary/10 text-secondary',
};

export function MyAppointmentsPage() {
  const [phone, setPhone] = useState('');
  const [appointments, setAppointments] = useState<Appointment[] | null>(null);
  const [tokens, setTokens] = useState<Token[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');

    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setError('');
    setLoading(true);
    setAppointments(null);
    setTokens(null);

    try {
      if (supabase) {
        const [appointmentsResult, tokensResult] = await Promise.all([
          supabase.rpc('get_appointments_by_phone', { p_phone: cleanPhone }),
          supabase.rpc('get_tokens_by_phone', { p_phone: cleanPhone }),
        ]);
        if (appointmentsResult.error) throw appointmentsResult.error;
        if (tokensResult.error) throw tokensResult.error;
        setAppointments((appointmentsResult.data ?? []) as Appointment[]);
        setTokens((tokensResult.data ?? []) as Token[]);
      } else {
        const storedAppointments: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
        const storedTokens: Token[] = JSON.parse(localStorage.getItem('tokens') || '[]');
        setAppointments(storedAppointments.filter((a) => a.patient_phone === cleanPhone));
        setTokens(storedTokens.filter((t) => t.patient_phone === cleanPhone));
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointment: Appointment) => {
    setCancellingId(appointment.id);
    try {
      if (supabase) {
        const { data, error: rpcError } = await supabase.rpc('cancel_appointment', {
          p_id: appointment.id,
          p_phone: appointment.patient_phone,
        });
        if (rpcError) throw rpcError;
        const updated = (data ?? [])[0] as Appointment | undefined;
        if (updated) {
          setAppointments((prev) => prev?.map((a) => (a.id === appointment.id ? updated : a)) ?? null);
        }
      } else {
        const stored: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
        const next = stored.map((a) => (a.id === appointment.id ? { ...a, status: 'cancelled' as const } : a));
        localStorage.setItem('appointments', JSON.stringify(next));
        setAppointments((prev) =>
          prev?.map((a) => (a.id === appointment.id ? { ...a, status: 'cancelled' as const } : a)) ?? null
        );
      }
    } catch {
      setError('Could not cancel the appointment. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MinimalHeader />

      <main className="flex-1 container-custom py-10 md:py-14">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-heading mb-2">My Appointments</h1>
          <p className="text-muted mb-8">
            Enter the phone number you used while booking to view and manage your appointments.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-10">
            <div className="relative flex-1">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <Button type="submit" variant="primary" size="lg" loading={loading} icon={<Search className="w-5 h-5" />}>
              Search
            </Button>
          </form>

          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-2 text-muted text-sm py-6">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading your appointments...
            </div>
          )}

          {appointments && appointments.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-2xl border border-border">
              <p className="text-muted mb-4">No appointments found for this number.</p>
              <Link to="/book">
                <Button variant="primary">Book an Appointment</Button>
              </Link>
            </div>
          )}

          {appointments && appointments.length > 0 && (
            <div className="space-y-4">
              {appointments.map((appt) => {
                const dateObj = new Date(`${appt.appointment_date}T00:00:00`);
                const canCancel = appt.status === 'pending' || appt.status === 'confirmed';
                return (
                  <div key={appt.id} className="bg-white rounded-2xl border border-border p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <p className="font-mono text-xs text-muted">{appt.booking_reference}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Stethoscope className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-heading">{appt.doctor_name}</span>
                        </div>
                        <p className="text-sm text-muted">{appt.department}</p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[appt.status]}`}
                      >
                        {appt.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-body mb-3">
                      <CalendarCheck className="w-4 h-4 text-muted" />
                      {formatDateLabel(dateObj)}
                      <Clock className="w-4 h-4 text-muted ml-2" />
                      {formatTimeLabel(appt.appointment_time)}
                    </div>
                    {appt.reason && (
                      <p className="text-sm text-muted mb-3">Reason: {appt.reason}</p>
                    )}
                    {canCancel && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<XCircle className="w-4 h-4" />}
                        loading={cancellingId === appt.id}
                        onClick={() => handleCancel(appt)}
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-600"
                      >
                        Cancel Appointment
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tokens && tokens.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg font-bold text-heading mb-4 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-primary" />
                My Tokens
              </h2>
              <div className="space-y-3">
                {tokens.map((t) => (
                  <div key={t.id} className="bg-white rounded-2xl border border-border p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted">Token Number</p>
                      <p className="text-2xl font-bold text-primary">#{t.token_number}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${TOKEN_STATUS_STYLES[t.status]}`}>
                        {t.status}
                      </span>
                      <p className="text-xs text-muted mt-1">{formatDateLabel(new Date(t.created_at))}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
