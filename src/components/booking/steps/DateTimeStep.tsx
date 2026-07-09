import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ArrowLeft, CalendarDays, Loader2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { supabase } from '../../../lib/supabase';
import {
  getAvailableDates,
  generateTimeSlots,
  formatDateLabel,
  formatTimeLabel,
  toDateKey,
} from '../../../data/bookingData';
import type { Doctor } from '../../../types';

interface DateTimeStepProps {
  doctor: Doctor;
  selectedDate: string;
  selectedTime: string;
  onContinue: (date: string, time: string) => void;
  onBack: () => void;
}

export function DateTimeStep({
  doctor,
  selectedDate,
  selectedTime,
  onContinue,
  onBack,
}: DateTimeStepProps) {
  const availableDates = useMemo(() => getAvailableDates(doctor, 14), [doctor]);
  const [date, setDate] = useState(selectedDate || toDateKey(availableDates[0]));
  const [time, setTime] = useState(selectedTime);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const allSlots = useMemo(() => generateTimeSlots(doctor), [doctor]);

  useEffect(() => {
    setTime('');

    if (!supabase) {
      setBookedSlots([]);
      return;
    }

    let active = true;
    setLoading(true);

    supabase
      .rpc('get_booked_slots', { p_doctor_id: doctor.id, p_date: date })
      .then(({ data, error }: { data: any; error: any }) => {
        if (!active) return;
        if (error) {
          setBookedSlots([]);
        } else {
          setBookedSlots((data ?? []).map((row: { appointment_time: string }) => row.appointment_time));
        }
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [doctor, date]);

  const isToday = (d: Date) => toDateKey(d) === toDateKey(new Date());
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const isSlotDisabled = (slot: string) => {
    if (bookedSlots.includes(slot)) return true;
    const selected = availableDates.find((d) => toDateKey(d) === date);
    if (selected && isToday(selected)) {
      const [h, m] = slot.split(':').map(Number);
      if (h * 60 + m <= currentMinutes) return true;
    }
    return false;
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-heading mb-2">Select Date & Time</h2>
      <p className="text-muted mb-6">
        Choose a convenient date and time slot for your consultation with {doctor.name}.
      </p>

      {/* Date Picker */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-heading mb-3 flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-primary" />
          Select Date
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {availableDates.map((d) => {
            const key = toDateKey(d);
            const isSelected = key === date;
            return (
              <button
                key={key}
                onClick={() => setDate(key)}
                className={`flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-xl border-2 transition-colors ${
                  isSelected
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-body border-border hover:border-primary/50'
                }`}
              >
                <span className="text-xs font-medium">
                  {d.toLocaleDateString('en-IN', { weekday: 'short' })}
                </span>
                <span className="text-lg font-bold">{d.getDate()}</span>
                <span className="text-xs">{d.toLocaleDateString('en-IN', { month: 'short' })}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-sm text-muted">{formatDateLabel(availableDates.find((d) => toDateKey(d) === date) ?? availableDates[0])}</p>
      </div>

      {/* Time Slots */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-heading mb-3">Select Time Slot</h3>
        {loading ? (
          <div className="flex items-center gap-2 text-muted text-sm py-6">
            <Loader2 className="w-4 h-4 animate-spin" />
            Checking availability...
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {allSlots.map((slot) => {
              const disabled = isSlotDisabled(slot);
              const isSelected = time === slot;
              return (
                <button
                  key={slot}
                  disabled={disabled}
                  onClick={() => setTime(slot)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                    disabled
                      ? 'bg-gray-50 text-gray-300 border-border cursor-not-allowed line-through'
                      : isSelected
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-body border-border hover:border-primary'
                  }`}
                >
                  {formatTimeLabel(slot)}
                </button>
              );
            })}
          </div>
        )}
        {!loading && allSlots.every((s) => isSlotDisabled(s)) && (
          <p className="mt-3 text-sm text-amber-600">
            No slots left for this date. Please choose another date.
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" size="lg" icon={<ArrowLeft className="w-5 h-5" />} onClick={onBack}>
          Back
        </Button>
        <Button
          variant="primary"
          size="lg"
          icon={<ArrowRight className="w-5 h-5" />}
          iconPosition="right"
          disabled={!time}
          onClick={() => onContinue(date, time)}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
