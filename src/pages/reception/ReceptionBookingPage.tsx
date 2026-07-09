import { useState } from 'react';
import { MinimalHeader } from '../../components/layout/MinimalHeader';
import { BookingStepper } from '../../components/booking/BookingStepper';
import { PatientIdentityStep } from '../../components/booking/steps/PatientIdentityStep';
import { DoctorSelectStep } from '../../components/booking/steps/DoctorSelectStep';
import { DateTimeStep } from '../../components/booking/steps/DateTimeStep';
import { PatientDetailsStep } from '../../components/booking/steps/PatientDetailsStep';
import { ReviewStep } from '../../components/booking/steps/ReviewStep';
import { ConfirmationStep } from '../../components/booking/steps/ConfirmationStep';
import { useAuth } from '../../hooks/useAuth';
import { useDoctors } from '../../hooks/useContent';
import { LogOut } from 'lucide-react';
import type { Appointment, BookingDraft, Doctor, PatientIdentity } from '../../types';

const emptyDraft: BookingDraft = {
  doctorId: '',
  appointmentDate: '',
  appointmentTime: '',
  patientName: '',
  patientPhone: '',
  patientEmail: '',
  patientAge: '',
  patientGender: '',
  reason: '',
};

export function ReceptionBookingPage() {
  const { signOut } = useAuth();
  const { data: doctors } = useDoctors();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<BookingDraft>(emptyDraft);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  const selectedDoctor: Doctor | undefined = doctors.find((d) => d.id === draft.doctorId);

  const handleIdentityContinue = (identity: PatientIdentity) => {
    setDraft((prev) => ({ ...prev, patientName: identity.fullName, patientPhone: identity.phoneNumber }));
    setStep(1);
  };

  const handleDoctorContinue = (doctor: Doctor) => {
    setDraft((prev) => ({ ...prev, doctorId: doctor.id }));
    setStep(2);
  };

  const handleDateTimeContinue = (date: string, time: string) => {
    setDraft((prev) => ({ ...prev, appointmentDate: date, appointmentTime: time }));
    setStep(3);
  };

  const handleDetailsContinue = (details: Pick<BookingDraft, 'patientEmail' | 'patientAge' | 'patientGender' | 'reason'>) => {
    setDraft((prev) => ({ ...prev, ...details }));
    setStep(4);
  };

  const handleConfirmed = (appointment: Appointment) => {
    setConfirmedAppointment(appointment);
    setStep(5);
  };

  const handleBookAnother = () => {
    setDraft(emptyDraft);
    setConfirmedAppointment(null);
    setStep(0);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MinimalHeader
        backTo="/reception/dashboard"
        backLabel="Appointments"
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

      <main className="flex-1 container-custom py-10 md:py-14">
        <div className="max-w-3xl mx-auto">
          {step < 5 && <BookingStepper currentStep={step} />}

          <div className="bg-white sm:bg-transparent">
            {step === 0 && (
              <PatientIdentityStep
                identity={{ fullName: draft.patientName, phoneNumber: draft.patientPhone }}
                onContinue={handleIdentityContinue}
              />
            )}

            {step === 1 && (
              <DoctorSelectStep
                doctors={doctors}
                selectedDoctorId={draft.doctorId}
                onContinue={handleDoctorContinue}
                onBack={() => setStep(0)}
              />
            )}

            {step === 2 && selectedDoctor && (
              <DateTimeStep
                doctor={selectedDoctor}
                selectedDate={draft.appointmentDate}
                selectedTime={draft.appointmentTime}
                onContinue={handleDateTimeContinue}
                onBack={() => setStep(1)}
              />
            )}

            {step === 3 && (
              <PatientDetailsStep
                draft={draft}
                onContinue={handleDetailsContinue}
                onBack={() => setStep(2)}
              />
            )}

            {step === 4 && selectedDoctor && (
              <ReviewStep
                draft={draft}
                doctor={selectedDoctor}
                onConfirmed={handleConfirmed}
                onBack={() => setStep(3)}
              />
            )}

            {step === 5 && confirmedAppointment && (
              <ConfirmationStep
                appointment={confirmedAppointment}
                onBookAnother={handleBookAnother}
                backTo="/reception/dashboard"
                backLabel="Back to Appointments"
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
