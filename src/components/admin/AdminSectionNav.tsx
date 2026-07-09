import { Link, useLocation } from 'react-router-dom';
import { CalendarCheck, Settings, Ticket } from 'lucide-react';

export function AdminSectionNav() {
  const location = useLocation();
  const isContent = location.pathname.startsWith('/reception/content');
  const isTokens = location.pathname.startsWith('/reception/tokens');
  const isAppointments = !isContent && !isTokens;

  return (
    <div className="flex gap-2 mb-6">
      <Link
        to="/reception/dashboard"
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
          isAppointments
            ? 'bg-primary text-white border-primary'
            : 'bg-white text-body border-border hover:border-primary'
        }`}
      >
        <CalendarCheck className="w-4 h-4" />
        Appointments
      </Link>
      <Link
        to="/reception/tokens"
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
          isTokens
            ? 'bg-primary text-white border-primary'
            : 'bg-white text-body border-border hover:border-primary'
        }`}
      >
        <Ticket className="w-4 h-4" />
        Tokens
      </Link>
      <Link
        to="/reception/content"
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
          isContent
            ? 'bg-primary text-white border-primary'
            : 'bg-white text-body border-border hover:border-primary'
        }`}
      >
        <Settings className="w-4 h-4" />
        Manage Website
      </Link>
    </div>
  );
}
