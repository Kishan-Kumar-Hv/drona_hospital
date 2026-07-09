import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Phone,
  Mail,
  CalendarCheck,
  CalendarPlus,
  Clock,
  RefreshCw,
  CheckCircle2,
  XCircle,
  CalendarClock,
  Loader2,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { MinimalHeader } from '../../components/layout/MinimalHeader';
import { AdminSectionNav } from '../../components/admin/AdminSectionNav';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { formatDateLabel, formatTimeLabel, toDateKey } from '../../data/bookingData';
import type { Appointment, AppointmentStatus } from '../../types';

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-secondary/10 text-secondary',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

const FILTERS = ['Today', 'Upcoming', 'All', 'Pending', 'Cancelled'] as const;
type Filter = (typeof FILTERS)[number];

export function ReceptionDashboardPage() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('Today');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError('');

    if (!supabase) {
      const stored: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
      setAppointments(stored);
      setLoading(false);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true });

    if (fetchError) {
      setError('Could not load appointments.');
    } else {
      setAppointments((data ?? []) as Appointment[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const today = toDateKey(new Date());

  const filtered = useMemo(() => {
    switch (filter) {
      case 'Today':
        return appointments.filter((a) => a.appointment_date === today && a.status !== 'cancelled');
      case 'Upcoming':
        return appointments.filter((a) => a.appointment_date >= today && a.status !== 'cancelled');
      case 'Pending':
        return appointments.filter((a) => a.status === 'pending');
      case 'Cancelled':
        return appointments.filter((a) => a.status === 'cancelled');
      default:
        return appointments;
    }
  }, [appointments, filter, today]);

  const stats = useMemo(() => {
    const todays = appointments.filter((a) => a.appointment_date === today && a.status !== 'cancelled');
    return {
      today: todays.length,
      pending: appointments.filter((a) => a.status === 'pending').length,
      confirmed: appointments.filter((a) => a.status === 'confirmed').length,
      total: appointments.length,
    };
  }, [appointments, today]);

  const updateStatus = async (appointment: Appointment, status: AppointmentStatus) => {
    setUpdatingId(appointment.id);

    if (!supabase) {
      const stored: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
      const next = stored.map((a) => (a.id === appointment.id ? { ...a, status } : a));
      localStorage.setItem('appointments', JSON.stringify(next));
      setAppointments(next);
      setUpdatingId(null);
      return;
    }

    const { error: updateError } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', appointment.id);

    if (!updateError) {
      setAppointments((prev) => prev.map((a) => (a.id === appointment.id ? { ...a, status } : a)));
    }
    setUpdatingId(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MinimalHeader
        backTo="/"
        backLabel="Patient Website"
        rightSlot={
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 text-sm font-medium text-body hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        }
      />

      <main className="flex-1 container-custom py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-heading">Reception Dashboard</h1>
            <p className="text-sm text-muted">Manage incoming appointment requests</p>
          </div>
        </div>

        <AdminSectionNav />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Today's Appointments" value={stats.today} icon={<CalendarCheck className="w-5 h-5 text-primary" />} />
          <StatCard label="Pending Confirmation" value={stats.pending} icon={<CalendarClock className="w-5 h-5 text-amber-500" />} />
          <StatCard label="Confirmed" value={stats.confirmed} icon={<CheckCircle2 className="w-5 h-5 text-secondary" />} />
          <StatCard label="Total Bookings" value={stats.total} icon={<Users className="w-5 h-5 text-primary" />} />
        </div>

        {/* Filters + Refresh */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  filter === f
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-body border-border hover:border-primary'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" icon={<RefreshCw className="w-4 h-4" />} onClick={fetchAppointments}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" icon={<CalendarPlus className="w-4 h-4" />} onClick={() => navigate('/reception/book')}>
            Book Appointment
          </Button>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {loading ? (
          <div className="flex items-center gap-2 text-muted text-sm py-12 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading appointments...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-border text-muted">
            No appointments in this view.
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((appt) => {
              const dateObj = new Date(`${appt.appointment_date}T00:00:00`);
              const isUpdating = updatingId === appt.id;
              return (
                <div key={appt.id} className="bg-white rounded-2xl border border-border p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-mono text-xs text-muted mb-1">{appt.booking_reference}</p>
                      <h3 className="font-semibold text-heading">{appt.patient_name}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted mt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" /> {appt.patient_phone}
                        </span>
                        {appt.patient_email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" /> {appt.patient_email}
                          </span>
                        )}
                        {appt.patient_age && (
                          <span>{appt.patient_age} yrs, {appt.patient_gender}</span>
                        )}
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[appt.status]}`}>
                      {appt.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-body mb-3 pb-3 border-b border-border">
                    <span className="font-medium text-heading">{appt.doctor_name}</span>
                    <span className="text-muted">{appt.department}</span>
                    <span className="flex items-center gap-1">
                      <CalendarCheck className="w-4 h-4 text-muted" /> {formatDateLabel(dateObj)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-muted" /> {formatTimeLabel(appt.appointment_time)}
                    </span>
                  </div>

                  {appt.reason && <p className="text-sm text-muted mb-3">Reason: {appt.reason}</p>}

                  <div className="flex flex-wrap gap-2">
                    {appt.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={<CheckCircle2 className="w-4 h-4" />}
                        loading={isUpdating}
                        onClick={() => updateStatus(appt, 'confirmed')}
                      >
                        Confirm
                      </Button>
                    )}
                    {appt.status === 'confirmed' && (
                      <Button
                        size="sm"
                        variant="primary"
                        icon={<CheckCircle2 className="w-4 h-4" />}
                        loading={isUpdating}
                        onClick={() => updateStatus(appt, 'completed')}
                      >
                        Mark Completed
                      </Button>
                    )}
                    {(appt.status === 'pending' || appt.status === 'confirmed') && (
                      <Button
                        size="sm"
                        variant="outline"
                        icon={<XCircle className="w-4 h-4" />}
                        loading={isUpdating}
                        onClick={() => updateStatus(appt, 'cancelled')}
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-600"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
      <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-heading leading-none">{value}</p>
        <p className="text-xs text-muted mt-1">{label}</p>
      </div>
    </div>
  );
}
