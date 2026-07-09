import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ShieldCheck } from 'lucide-react';
import { MinimalHeader } from '../../components/layout/MinimalHeader';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

export function ReceptionLoginPage() {
  const { isAuthenticated, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('admin@dronahealthcare.in');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    const redirectTo = (location.state as { from?: string })?.from || '/reception/dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);

    if (signInError) {
      setError(signInError);
    } else {
      navigate('/reception/dashboard', { replace: true });
    }
  };

  const handleInstantAccess = async () => {
    setSubmitting(true);
    setError('');
    const { error: signInError } = await signIn('admin@dronahealthcare.in', 'admin');
    setSubmitting(false);

    if (signInError) {
      setError(signInError);
    } else {
      navigate('/reception/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MinimalHeader backTo="/" backLabel="Patient Website" />

      <main className="flex-1 flex items-center justify-center container-custom py-10">
        <div className="w-full max-w-md bg-white rounded-2xl border border-border p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-heading">Reception Staff Login</h1>
          </div>
          <p className="text-muted text-sm mb-6">
            Sign in to view and manage patient appointment requests.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-heading mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="reception@dronahealthcare.in"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-heading mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              <Button type="submit" variant="primary" size="lg" loading={submitting} className="w-full">
                Sign In
              </Button>
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-border"></div>
                <span className="flex-shrink mx-4 text-muted text-xs font-semibold uppercase">Or</span>
                <div className="flex-grow border-t border-border"></div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="lg"
                loading={submitting}
                onClick={handleInstantAccess}
                className="w-full bg-primary/5 text-primary border-primary/20 hover:bg-primary/10"
              >
                Instant Demo Access
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
