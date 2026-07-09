# Aditi Hospital — Digital Experience Platform

A two-part hospital/clinic MVP built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

- **MVP1 — Hospital Website**: A modern, trust-focused marketing site showcasing services, doctors, and facilities.
- **MVP2 — Appointment Booking System**: A patient-facing online booking flow plus a reception staff dashboard to manage incoming appointment requests in real time.

**Live demo**: https://marvelous-mooncake-926a7d.netlify.app

## MVP1 Features (Website)

- Sticky navigation with mobile-responsive menu
- Hero section with compelling CTAs
- Trust statistics with count-up animations
- Why Choose Us section with feature cards
- Services showcase with 8 healthcare services
- Doctor profiles with detailed modals
- Facilities gallery with image modals
- Patient journey timeline
- Callback request form with validation and Supabase integration
- Patient testimonials with ratings
- FAQ accordion section
- Final conversion CTA section
- Contact section with embedded Google Map
- Premium footer with social links

## MVP2 Features (Appointment Booking System)

**Patient booking flow** (`/book`):
1. **Your Details** — patient identifies themselves with name + phone number (acts as a lightweight login, used later to look up bookings).
2. **Choose Doctor** — browse doctors by department, see specialty, experience, working hours, and consultation fee.
3. **Date & Time** — pick from the next 14 available working days; real-time slot availability is checked against existing bookings (already-booked slots are disabled).
4. **Visit Details** — age, gender, optional email, and reason for visit.
5. **Review & Confirm** — review everything and submit. A unique booking reference is generated.
6. **Confirmation** — booking reference + summary, with links to "My Appointments" or book another.

**My Appointments** (`/my-appointments`):
- Patients look up all their appointments using their phone number.
- Each appointment shows status (pending / confirmed / completed / cancelled).
- Patients can cancel their own pending/confirmed appointments.

**Reception Dashboard** (`/reception/login` → `/reception/dashboard`):
- Secure staff login (Supabase Auth).
- Live stats: today's appointments, pending confirmations, confirmed, total bookings.
- Filterable appointment list (Today / Upcoming / Pending / Cancelled / All) showing full patient details (name, phone, email, age, gender, reason).
- One-click status updates: Confirm → Completed, or Cancel.

## Tech Stack

- **React 18** with TypeScript
- **React Router** for client-side routing
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Supabase** for the database, RLS policies, RPC functions, and reception authentication

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase project (see [SETUP.md](./SETUP.md) for full setup instructions)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root (see `.env.example`):

```bash
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Without these, the app falls back to `localStorage` so the UI remains demoable, but the
reception dashboard won't be able to see appointments booked from a different browser/device.

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Type Check

```bash
npm run typecheck
```

## Project Structure

```
src/
├── components/
│   ├── sections/        # MVP1 landing page sections
│   ├── ui/               # Shared UI primitives (Button, Card, Section)
│   ├── layout/
│   │   └── MinimalHeader.tsx     # Header for booking/reception pages
│   ├── booking/
│   │   ├── BookingStepper.tsx
│   │   └── steps/                # One component per booking wizard step
│   └── reception/
│       └── ProtectedRoute.tsx    # Auth guard for /reception/dashboard
├── pages/
│   ├── HomePage.tsx               # MVP1 landing page
│   ├── BookingPage.tsx            # MVP2 booking wizard
│   ├── MyAppointmentsPage.tsx     # MVP2 patient appointment lookup
│   └── reception/
│       ├── ReceptionLoginPage.tsx
│       └── ReceptionDashboardPage.tsx
├── data/
│   ├── hospitalData.ts  # Centralized MVP1 content configuration
│   └── bookingData.ts   # Doctors, departments, slot-generation helpers
├── hooks/
│   ├── useAnimation.ts  # Custom animation hooks
│   ├── useBooking.tsx   # Callback-form pre-fill context (MVP1)
│   └── useAuth.ts       # Reception authentication (Supabase Auth)
├── lib/
│   └── supabase.ts       # Shared Supabase client
├── types/
│   └── index.ts          # TypeScript type definitions
├── App.tsx               # Route definitions
├── main.tsx
└── index.css

supabase/
└── migrations/
    ├── 20260614155147_callback_requests_table.sql
    └── 20260615000000_appointments_table.sql   # MVP2 schema, RLS, RPCs
```

## Content Management

All hospital content is centralized in `src/data/hospitalData.ts`. To update:

- Hospital information (name, address, contact)
- Navigation links
- Trust statistics
- Why Choose Us features
- Services
- Doctors
- Facilities
- Patient testimonials
- FAQs
- Social media links

Doctor schedules, departments, and consultation fees used by the booking system live in
`src/data/bookingData.ts`.

## Deployment

See [SETUP.md](./SETUP.md) for the full Supabase + Netlify deployment guide.

Quick version:

1. Create a Supabase project and run the migrations in `supabase/migrations/`.
2. Create a reception staff user under Supabase Authentication.
3. Connect this GitHub repo to Netlify ("Add new site → Import an existing project").
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in Netlify.
5. Deploy — Netlify will run `npm run build` and publish the `dist` folder automatically.

## Color System

- **Background:** #FAFAFA
- **Primary CTA:** #0F4C81 (Professional Blue)
- **Secondary CTA:** #2A7F62 (Trust Green)
- **Headings:** #1F2937
- **Body Text:** #374151
- **Muted Text:** #6B7280
- **Borders:** #E5E7EB

## Browser Support

The website supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

All rights reserved. This is a proprietary project for Aditi Hospital.
