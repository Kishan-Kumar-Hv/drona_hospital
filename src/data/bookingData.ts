import type { Doctor } from '../types';

export const genderOptions = ['Male', 'Female', 'Other'];

const DAY_MS = 24 * 60 * 60 * 1000;

// Returns the next `count` dates (including today) on which the given doctor works
export function getAvailableDates(doctor: Doctor, count = 14): Date[] {
  const dates: Date[] = [];
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (dates.length < count) {
    if (doctor.workingDays.includes(cursor.getDay())) {
      dates.push(new Date(cursor));
    }
    cursor = new Date(cursor.getTime() + DAY_MS);
  }

  return dates;
}

// Generates all slot start times ("HH:mm") for a doctor on a given day
export function generateTimeSlots(doctor: Doctor): string[] {
  const slots: string[] = [];
  const [startH, startM] = doctor.startTime.split(':').map(Number);
  const [endH, endM] = doctor.endTime.split(':').map(Number);

  let minutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  while (minutes + doctor.slotMinutes <= endMinutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    minutes += doctor.slotMinutes;
  }

  return slots;
}

// Formats "HH:mm" (24h) to a friendly "h:mm AM/PM" label
export function formatTimeLabel(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

// Formats a Date as YYYY-MM-DD (local date, no timezone shift)
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Formats a Date for display, e.g. "Mon, 15 Jun"
export function formatDateLabel(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

// Generates a human-friendly booking reference, e.g. AH-20260615-4F2K
export function generateBookingReference(): string {
  const now = new Date();
  const datePart = toDateKey(now).replace(/-/g, '');
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DH-${datePart}-${randomPart}`;
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Formats a doctor's working days + hours as a friendly string, e.g.
// "Mon - Sat, 10:00 AM - 2:00 PM"
export function formatAvailability(doctor: Doctor): string {
  const days = [...doctor.workingDays].sort((a, b) => a - b);
  let daysLabel: string;

  if (days.length === 0) {
    daysLabel = '';
  } else {
    const isConsecutiveRun = days.every((d, i) => i === 0 || d === days[i - 1] + 1);
    daysLabel = isConsecutiveRun && days.length > 1
      ? `${DAY_LABELS[days[0]]} - ${DAY_LABELS[days[days.length - 1]]}`
      : days.map((d) => DAY_LABELS[d]).join(', ');
  }

  const hoursLabel = `${formatTimeLabel(doctor.startTime)} - ${formatTimeLabel(doctor.endTime)}`;
  return daysLabel ? `${daysLabel}, ${hoursLabel}` : hoursLabel;
}
