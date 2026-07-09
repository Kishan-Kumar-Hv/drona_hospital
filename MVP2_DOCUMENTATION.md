# Aditi Hospital – Appointment Booking System (MVP2)

## Deployed Application

- **Website + Booking System**: https://marvelous-mooncake-926a7d.netlify.app
- **Patient Booking Flow**: https://marvelous-mooncake-926a7d.netlify.app/book
- **My Appointments**: https://marvelous-mooncake-926a7d.netlify.app/my-appointments
- **Reception Dashboard**: https://marvelous-mooncake-926a7d.netlify.app/reception/login

## Project Overview

MVP1 established Aditi Hospital's digital front door — a trustworthy, modern website that
turns visitors into leads. MVP2 builds directly on that foundation by solving the next
problem in the patient journey: **getting an actual appointment on the books without a
phone call**, and giving the hospital's reception team a single place to see and manage
every request that comes in.

The goal was not just "a form that sends an email" — it's a real two-sided booking system:
patients get a guided, low-friction booking experience; reception gets a live operational
dashboard.

## Problem Analysis

### Patient Challenges
- Booking currently requires a phone call during clinic hours.
- No visibility into doctor availability before calling.
- No way to check or cancel an appointment without calling again.

### Hospital/Reception Challenges
- All appointment requests arrive via phone, creating bottlenecks and missed calls.
- No central system to track which slots are taken, confirmed, or completed.
- No structured record of patient details (age, gender, reason for visit) ahead of the visit.

## Solution Overview

A two-sided appointment system:

1. **Patient-facing booking wizard** — a guided, 5-step flow that feels as easy as booking a
   restaurant table.
2. **Reception dashboard** — a real-time, filterable view of every booking request with
   one-click status management.

Both sides share a single Supabase-backed `appointments` table, so the moment a patient
books, reception sees it — no manual relay required.

## Features Included & Why

### 1. Patient Identification ("Login") — Name + Phone Number
**Why selected**: A full account/password system adds friction that real patients (often
elderly or first-time digital users) will abandon. Phone-based identification is the pattern
patients already expect (every clinic asks "what's your number?"), and it doubles as the key
for "My Appointments" lookups later — no password to forget.
**Business value**: Removes the single biggest drop-off point in any booking funnel —
account creation — while still giving the hospital a reliable patient identifier.

### 2. Doctor & Department Selection
**Why selected**: Patients think in terms of "I need a child specialist" or "I need a
gynecologist," not doctor names. Filtering by department first, then showing doctor cards
with experience, working hours, and consultation fee, mirrors how patients actually decide.
**Business value**: Sets expectations on cost and timing upfront, reducing no-shows and
"surprise fee" complaints at the front desk.

### 3. Real-Time Date & Time Slot Selection
**Why selected**: Slots are generated from each doctor's actual working hours and checked
against existing bookings in the database — already-booked slots are visibly disabled. This
was the highest-value technical investment in the MVP because it directly prevents double
bookings, which is the #1 operational headache for any appointment system.
**Business value**: Eliminates double-booking conflicts and the awkward "sorry, that slot's
taken, can you call back" conversation.

### 4. Visit Details (Age, Gender, Reason for Visit)
**Why selected**: Gives the doctor/reception context before the patient arrives, without
requiring a long medical history form that would scare off a quick booking.
**Business value**: Helps reception triage urgent cases and helps doctors prepare.

### 5. Review & Confirm with Booking Reference
**Why selected**: A clear summary screen plus a unique reference number (e.g.
`AH-20260615-4F2K`) gives patients confidence the booking was received and a way to refer to
it if they call in.
**Business value**: Reduces "did my booking go through?" anxiety and support calls.

### 6. My Appointments (Patient Self-Service)
**Why selected**: Patients can look up all their bookings by phone number and cancel a
pending/confirmed appointment themselves.
**Business value**: Self-service cancellations free up slots automatically and reduce
no-show rates — a cancelled-in-advance slot can be rebooked by someone else.

### 7. Reception Dashboard with Live Stats & Status Workflow
**Why selected**: Reception staff need one screen that answers "what's happening today?" —
hence stat cards for Today's Appointments, Pending Confirmations, Confirmed, and Total
Bookings, plus filters (Today / Upcoming / Pending / Cancelled / All).
Each booking can move through a simple status lifecycle: **Pending → Confirmed → Completed**,
or **Cancelled** at any point before completion — matching how a real front desk operates.
**Business value**: Replaces a paper register or shared spreadsheet with a live, accurate,
shared source of truth — the core operational efficiency win for the clinic.

### 8. Secure Staff Login
**Why selected**: Patient data (phone numbers, ages, visit reasons) should not be publicly
readable. Reception access is gated behind Supabase Authentication, while patients can only
ever see their own bookings (enforced at the database level via Row Level Security).
**Business value**: Demonstrates a baseline of data privacy and access control appropriate
for healthcare data — important for client trust and future compliance needs.

## Design & UX Decisions

- **Visual continuity with MVP1**: The booking system reuses the exact same design tokens
  (colors, button styles, card styles, fonts) and component library (`Button`, `Card`,
  `Section`) from the website, so it feels like one product, not a bolted-on tool.
- **Step-based wizard with progress indicator**: Breaks a potentially long form into small,
  digestible steps with a visible sense of progress — proven to reduce abandonment versus a
  single long form.
- **Mobile-first**: Most patients will book from a phone; slot grids, date pickers, and forms
  are all touch-friendly and responsive.
- **Graceful degradation**: If the backend isn't configured, the app falls back to
  `localStorage` so the UI is always demoable, even before Supabase is wired up.

## Team Implementation & Decision-Making Approach

- Reviewed MVP1's existing codebase, design system, and Supabase usage before writing any
  new code, to ensure MVP2 extends rather than duplicates it.
- Chose to integrate MVP2 into the same codebase/repo as new routes (`/book`,
  `/my-appointments`, `/reception/*`) rather than a separate app — one deployable site is a
  stronger demo and easier for the client to navigate.
- Prioritized the database design (RLS policies, double-booking prevention via a partial
  unique index, RPC functions for safe anonymous lookups) early, since this is the part that
  is hardest to retrofit later and is the foundation of "every detail is sent to reception."
- Deferred features that don't change the demo's impact but add significant complexity (SMS
  OTP verification, payment collection, doctor-managed availability) to "Future
  Enhancements" — see below.

## Business Value Delivered

- **Reduced phone dependency**: Patients can book 24/7 without calling during clinic hours.
- **Zero double-bookings**: Enforced at the database level, not just in the UI.
- **Operational visibility**: Reception sees a live, prioritized worklist instead of a
  paper diary.
- **Patient self-service**: Cancellations happen instantly, freeing slots automatically.
- **Foundation for growth**: The same `appointments` table and dashboard can be extended to
  support SMS reminders, multiple branches, and doctor-side apps without a redesign.

## Future Enhancements

- **SMS/OTP verification** for patient identification (stronger than phone-only).
- **Automated SMS/WhatsApp reminders** 24 hours before the appointment.
- **Doctor-side portal** to manage their own availability and view their daily list.
- **Walk-in registration** directly from the reception dashboard.
- **Payment integration** for online consultation fee pre-payment.
- **Multi-branch support** if Aditi Hospital expands to additional locations.
- **Analytics dashboard** for management (bookings per department, no-show rates, peak
  hours).
- **Patient medical history** linked to phone number for returning patients.

## Deliverables

- **Live Application**: _(added after Netlify deployment)_
- **Source Repository**: https://github.com/kveeresh288/aditi-hospital-appointment-system
- **Setup Guide**: [SETUP.md](./SETUP.md)

## Conclusion

MVP2 turns Aditi Hospital's digital presence from informational into transactional —
patients can now complete the entire "find a doctor → book a slot → show up" journey online,
while reception gains a real-time operational tool that replaces manual, phone-based
coordination. Together, MVP1 and MVP2 demonstrate a complete, end-to-end digital patient
experience that a clinic could put into production with minimal additional work.
