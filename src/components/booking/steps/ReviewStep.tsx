import { useState } from 'react';
import {
  ArrowLeft,
  CalendarCheck,
  User,
  Phone,
  Mail,
  Stethoscope,
  Cake,
  Users,
  FileText,
  AlertCircle,
  IndianRupee,
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { supabase } from '../../../lib/supabase';
import {
  formatDateLabel,
  formatTimeLabel,
  generateBookingReference,
} from '../../../data/bookingData';
import type { Appointment, BookingDraft, Doctor } from '../../../types';

interface ReviewStepProps {
  draft: BookingDraft;
  doctor: Doctor;
  onConfirmed: (appointment: Appointment) => void;
  onBack: () => void;
}

export function ReviewStep({ draft, doctor, onConfirmed, onBack }: ReviewStepProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const dateObj = new Date(`${draft.appointmentDate}T00:00:00`);

  const handleConfirm = async () => {
    setSubmitting(true);
    setError('');

    const appointmentPayload = {
      booking_reference: generateBookingReference(),
      patient_name: draft.patientName,
      patient_phone: draft.patientPhone,
      patient_email: draft.patientEmail || null,
      patient_age: draft.patientAge ? Number(draft.patientAge) : null,
      patient_gender: draft.patientGender || null,
      doctor_id: doctor.id,
      doctor_name: doctor.name,
      department: doctor.department,
      appointment_date: draft.appointmentDate,
      appointment_time: draft.appointmentTime,
      reason: draft.reason || null,
      status: 'pending' as const,
    };

    try {
      if (supabase) {
        const { error: insertError } = await supabase
          .from('appointments')
          .insert([appointmentPayload]);

        if (insertError) {
          if (insertError.code === '23505') {
            throw new Error('That time slot was just booked by someone else. Please pick another slot.');
          }
          throw insertError;
        }

        const newAppointment: Appointment = {
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          notes: null,
          ...appointmentPayload,
        };
        onConfirmed(newAppointment);
      } else {
        // Fallback to localStorage when Supabase isn't configured
        const stored: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
        const newAppointment: Appointment = {
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          notes: null,
          ...appointmentPayload,
        };
        stored.push(newAppointment);
        localStorage.setItem('appointments', JSON.stringify(stored));
        onConfirmed(newAppointment);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-heading mb-2">Review & Confirm</h2>
      <p className="text-muted mb-6">Please review your appointment details before confirming.</p>

      <div className="bg-white rounded-2xl border border-border p-6 space-y-4 max-w-xl">
        <div className="flex items-start gap-3">
          <Stethoscope className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-muted">Doctor</p>
            <p className="font-semibold text-heading">{doctor.name}</p>
            <p className="text-sm text-muted">{doctor.specialty} &middot; {doctor.department}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 border-t border-border pt-4">
          <CalendarCheck className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-muted">Date & Time</p>
            <p className="font-semibold text-heading">
              {formatDateLabel(dateObj)} &middot; {formatTimeLabel(draft.appointmentTime)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 border-t border-border pt-4">
          <User className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-muted">Patient</p>
            <p className="font-semibold text-heading">{draft.patientName}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted mt-1">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> {draft.patientPhone}
              </span>
              {draft.patientEmail && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {draft.patientEmail}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Cake className="w-3.5 h-3.5" /> {draft.patientAge} yrs
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> {draft.patientGender}
              </span>
            </div>
          </div>
        </div>

        {draft.reason && (
          <div className="flex items-start gap-3 border-t border-border pt-4">
            <FileText className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted">Reason for Visit</p>
              <p className="text-body">{draft.reason}</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 border-t border-border pt-4">
          <IndianRupee className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-muted">Consultation Fee</p>
            <p className="font-semibold text-heading">₹{doctor.consultationFee} (payable at the clinic)</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 max-w-xl p-4 bg-red-50 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="flex gap-3 mt-8">
        <Button variant="outline" size="lg" icon={<ArrowLeft className="w-5 h-5" />} onClick={onBack} disabled={submitting}>
          Back
        </Button>
        <Button variant="primary" size="lg" loading={submitting} onClick={handleConfirm}>
          Confirm Appointment
        </Button>
      </div>
    </div>
  );
}
