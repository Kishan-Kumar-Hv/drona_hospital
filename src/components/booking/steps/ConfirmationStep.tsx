import { Link } from 'react-router-dom';
import { CheckCircle2, CalendarCheck, Stethoscope, ClipboardList, Home } from 'lucide-react';
import { Button } from '../../ui/Button';
import { formatDateLabel, formatTimeLabel } from '../../../data/bookingData';
import type { Appointment } from '../../../types';

interface ConfirmationStepProps {
  appointment: Appointment;
  onBookAnother: () => void;
  backTo?: string;
  backLabel?: string;
}

export function ConfirmationStep({ appointment, onBookAnother, backTo = '/', backLabel = 'Back to Home' }: ConfirmationStepProps) {
  const dateObj = new Date(`${appointment.appointment_date}T00:00:00`);

  return (
    <div className="text-center max-w-xl mx-auto">
      <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-9 h-9 text-secondary" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-heading mb-2">Appointment Requested!</h2>
      <p className="text-muted mb-8">
        Thank you, {appointment.patient_name}. Your appointment request has been sent to our
        reception team. You'll receive a call to confirm shortly.
      </p>

      <div className="bg-white rounded-2xl border border-border p-6 text-left space-y-4 mb-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <span className="text-sm text-muted">Booking Reference</span>
          <span className="font-mono font-semibold text-primary">{appointment.booking_reference}</span>
        </div>
        <div className="flex items-start gap-3">
          <Stethoscope className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-muted">Doctor</p>
            <p className="font-semibold text-heading">{appointment.doctor_name}</p>
            <p className="text-sm text-muted">{appointment.department}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 border-t border-border pt-4">
          <CalendarCheck className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-muted">Date & Time</p>
            <p className="font-semibold text-heading">
              {formatDateLabel(dateObj)} &middot; {formatTimeLabel(appointment.appointment_time)}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 border-t border-border pt-4">
          <ClipboardList className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-muted">Status</p>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 capitalize">
              {appointment.status} &mdash; Awaiting confirmation
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/my-appointments">
          <Button variant="primary" size="lg" icon={<ClipboardList className="w-5 h-5" />}>
            View My Appointments
          </Button>
        </Link>
        <Button variant="outline" size="lg" onClick={onBookAnother}>
          Book Another Appointment
        </Button>
        <Link to={backTo}>
          <Button variant="outline" size="lg" icon={<Home className="w-5 h-5" />}>
            {backLabel}
          </Button>
        </Link>
      </div>
    </div>
  );
}
