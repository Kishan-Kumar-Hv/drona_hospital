# Setup Guide — Supabase Backend & Netlify Deployment

This guide covers everything needed to run the Appointment Booking System (MVP2) with a
real shared backend, and to deploy the site live.

## 1. Create a Supabase Project

1. Go to https://supabase.com and sign in (or create a free account).
2. Click **New Project**. Choose any name (e.g. `aditi-hospital`), set a database password,
   and pick a region close to your users (e.g. `ap-south-1` for India).
3. Wait ~2 minutes for the project to provision.

## 2. Run the Database Migrations

1. In your Supabase project, open **SQL Editor**.
2. Open `supabase/migrations/20260614155147_callback_requests_table.sql` from this repo,
   copy its contents, paste into a new SQL query, and click **Run**.
3. Do the same for `supabase/migrations/20260615000000_appointments_table.sql`.

This creates:
- `callback_requests` table (MVP1 "Request a Callback" form)
- `appointments` table (MVP2 booking system) with Row Level Security policies and helper
  functions (`get_booked_slots`, `get_appointments_by_phone`, `cancel_appointment`)

## 3. Create a Reception Staff Account

The reception dashboard (`/reception/dashboard`) uses Supabase Auth (email + password).

1. In Supabase, go to **Authentication → Users → Add User**.
2. Enter an email (e.g. `reception@aditihospital.in`) and a password.
3. Click **Create User**. (Disable "Auto Confirm User" only if you've set up email — for the
   demo, leave auto-confirm enabled so the account is usable immediately.)
4. Share these credentials with whoever staffs the reception dashboard.

You can create additional staff accounts the same way.

## 4. Get Your API Credentials

1. In Supabase, go to **Project Settings → API**.
2. Copy the **Project URL** and the **anon public** key.

## 5. Configure Environment Variables

### Local development

Create a `.env` file in the project root:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Then run:

```bash
npm install
npm run dev
```

### Netlify

1. In Netlify, go to **Site configuration → Environment variables**.
2. Add:
   - `VITE_SUPABASE_URL` = your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
3. Trigger a redeploy (Netlify rebuilds automatically when env vars change, or use
   **Deploys → Trigger deploy → Clear cache and deploy site**).

## 6. Deploy to Netlify (Connect to GitHub)

1. Go to https://app.netlify.com and log in.
2. Click **Add new site → Import an existing project**.
3. Choose **GitHub** and authorize Netlify if prompted.
4. Select the repository: `kveeresh288/aditi-hospital-appointment-system`.
5. Build settings (Netlify should auto-detect these from `package.json`/Vite, but confirm):
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Add the environment variables from Step 5 before the first deploy (or add them after and
   redeploy).
7. Click **Deploy site**. Netlify will give you a live URL (e.g.
   `https://aditi-hospital-appointments.netlify.app`).

From now on, every push to the `main` branch will automatically trigger a new deploy.

## 7. Verify Everything Works

1. Visit the deployed site → click **Book Appointment**.
2. Complete the booking flow (any name/phone/doctor/date/time).
3. Go to `/my-appointments` and look up the appointment by phone number — confirm it shows
   up with status "pending".
4. Go to `/reception/login`, sign in with the staff account from Step 3.
5. Confirm the new appointment appears on the dashboard, and that you can mark it
   **Confirmed** → **Completed**, or **Cancel** it.
6. Open `/my-appointments` again — the status update from the dashboard should be reflected.

If steps 3–6 don't sync between two browser tabs/devices, double-check the environment
variables are set correctly and that the SQL migrations ran without errors.

## Fallback Mode (No Supabase)

If `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are not set, the app still works for demo
purposes using `localStorage` — but data won't be shared between the patient and reception
views unless they're the same browser. This is useful for a quick local preview, but a real
Supabase project is recommended for the live demo so the "every detail is sent to reception"
requirement actually works across devices.
