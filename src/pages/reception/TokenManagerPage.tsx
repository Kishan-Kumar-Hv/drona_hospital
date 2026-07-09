import { useEffect, useMemo, useState, useCallback } from 'react';
import { LogOut, RefreshCw, CheckCircle2, Loader2, Ticket, ShieldCheck, FileBarChart } from 'lucide-react';
import { MinimalHeader } from '../../components/layout/MinimalHeader';
import { AdminSectionNav } from '../../components/admin/AdminSectionNav';
import { TokenReportModal } from '../../components/admin/TokenReportModal';
import { BookTokenModal } from '../../components/admin/BookTokenModal';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { toDateKey } from '../../data/bookingData';
import type { TokenReport } from '../../lib/whatsapp';
import type { Token, TokenStatus } from '../../types';

const STATUS_STYLES: Record<TokenStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  completed: 'bg-secondary/10 text-secondary',
};

const FILTERS = ['Today', 'Pending', 'Completed', 'All'] as const;
type Filter = (typeof FILTERS)[number];

const TOKENS_STORAGE_KEY = 'tokens';

export function TokenManagerPage() {
  const { signOut } = useAuth();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('Today');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [updating, setUpdating] = useState(false);
  const [report, setReport] = useState<TokenReport | null>(null);
  const [showBookToken, setShowBookToken] = useState(false);

  const fetchTokens = useCallback(async () => {
    setLoading(true);
    setError('');

    if (!supabase) {
      const stored: Token[] = JSON.parse(localStorage.getItem(TOKENS_STORAGE_KEY) || '[]');
      setTokens([...stored].sort((a, b) => a.token_number - b.token_number));
      setLoading(false);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from('tokens')
      .select('*')
      .order('token_number', { ascending: true });

    if (fetchError) {
      setError('Could not load tokens.');
    } else {
      setTokens((data ?? []) as Token[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  const today = toDateKey(new Date());

  const filtered = useMemo(() => {
    switch (filter) {
      case 'Today':
        return tokens.filter((t) => toDateKey(new Date(t.created_at)) === today);
      case 'Pending':
        return tokens.filter((t) => t.status === 'pending');
      case 'Completed':
        return tokens.filter((t) => t.status === 'completed');
      default:
        return tokens;
    }
  }, [tokens, filter, today]);

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      if (prev.size === filtered.length) return new Set();
      return new Set(filtered.map((t) => t.id));
    });
  };

  const markSelectedCompleted = async () => {
    if (selectedIds.size === 0) return;
    setUpdating(true);
    const ids = Array.from(selectedIds);

    if (!supabase) {
      const stored: Token[] = JSON.parse(localStorage.getItem(TOKENS_STORAGE_KEY) || '[]');
      const next = stored.map((t) => (ids.includes(t.id) ? { ...t, status: 'completed' as const } : t));
      localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(next));
      setTokens([...next].sort((a, b) => a.token_number - b.token_number));
      setSelectedIds(new Set());
      setUpdating(false);
      return;
    }

    const { error: updateError } = await supabase.from('tokens').update({ status: 'completed' }).in('id', ids);

    if (!updateError) {
      setTokens((prev) => prev.map((t) => (ids.includes(t.id) ? { ...t, status: 'completed' as const } : t)));
      setSelectedIds(new Set());
    }
    setUpdating(false);
  };

  const generateReport = () => {
    const todaysTokens = tokens.filter((t) => toDateKey(new Date(t.created_at)) === today);
    const completed = todaysTokens.filter((t) => t.status === 'completed');
    const pending = todaysTokens.filter((t) => t.status === 'pending');

    const genderCounts: Record<string, number> = {};
    for (const t of todaysTokens) {
      const gender = t.patient_gender || 'Unknown';
      genderCounts[gender] = (genderCounts[gender] || 0) + 1;
    }

    setReport({
      date: new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      total: todaysTokens.length,
      completed: completed.length,
      pending: pending.length,
      genderCounts,
      pendingTokenNumbers: pending.map((t) => t.token_number).sort((a, b) => a - b),
    });
  };

  const allSelected = filtered.length > 0 && selectedIds.size === filtered.length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MinimalHeader
        backTo="/"
        backLabel="Patient Website"
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

      <main className="flex-1 container-custom py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-heading">Token Manager</h1>
            <p className="text-sm text-muted">View and manage patient queue tokens</p>
          </div>
        </div>

        <AdminSectionNav />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  filter === f
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-body border-border hover:border-primary'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" icon={<RefreshCw className="w-4 h-4" />} onClick={fetchTokens}>
              Refresh
            </Button>
            <Button variant="outline" size="sm" icon={<Ticket className="w-4 h-4" />} onClick={() => setShowBookToken(true)}>
              Book Token
            </Button>
            <Button variant="primary" size="sm" icon={<FileBarChart className="w-4 h-4" />} onClick={generateReport}>
              Generate Report
            </Button>
          </div>
        </div>

        {selectedIds.size > 0 && (
          <div className="mb-4 flex items-center justify-between gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
            <p className="text-sm font-medium text-heading">{selectedIds.size} token(s) selected</p>
            <Button
              size="sm"
              variant="secondary"
              icon={<CheckCircle2 className="w-4 h-4" />}
              loading={updating}
              onClick={markSelectedCompleted}
            >
              Mark Selected as Completed
            </Button>
          </div>
        )}

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {loading ? (
          <div className="flex items-center gap-2 text-muted text-sm py-12 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading tokens...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-border text-muted">
            <Ticket className="w-8 h-8 mx-auto mb-2 text-muted" />
            No tokens in this view.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  <th className="px-4 py-3 w-10">
                    <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="w-4 h-4 accent-primary" />
                  </th>
                  <th className="px-4 py-3 font-semibold">Token #</th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Age</th>
                  <th className="px-4 py-3 font-semibold">Gender</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-b-0 hover:bg-background/50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(t.id)}
                        onChange={() => toggleSelected(t.id)}
                        className="w-4 h-4 accent-primary"
                      />
                    </td>
                    <td className="px-4 py-3 font-bold text-primary">#{t.token_number}</td>
                    <td className="px-4 py-3 font-medium text-heading">{t.patient_name}</td>
                    <td className="px-4 py-3 text-body">{t.patient_phone}</td>
                    <td className="px-4 py-3 text-body">{t.patient_age ?? '-'}</td>
                    <td className="px-4 py-3 text-body">{t.patient_gender ?? '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[t.status]}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted whitespace-nowrap">
                      {new Date(t.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {report && <TokenReportModal report={report} onClose={() => setReport(null)} />}
      {showBookToken && (
        <BookTokenModal
          onClose={() => setShowBookToken(false)}
          onSuccess={() => { fetchTokens(); setShowBookToken(false); }}
        />
      )}
    </div>
  );
}
