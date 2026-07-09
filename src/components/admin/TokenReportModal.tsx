import { X, MessageCircle, Ticket, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { buildTokenReportMessage, getWhatsappShareUrl, DOCTOR_WHATSAPP_NUMBER } from '../../lib/whatsapp';
import type { TokenReport } from '../../lib/whatsapp';

interface TokenReportModalProps {
  report: TokenReport;
  onClose: () => void;
}

export function TokenReportModal({ report, onClose }: TokenReportModalProps) {
  const completionRate = report.total === 0 ? 0 : Math.round((report.completed / report.total) * 100);
  const message = buildTokenReportMessage(report);
  const whatsappUrl = getWhatsappShareUrl(DOCTOR_WHATSAPP_NUMBER, message);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl border border-border max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-bold text-heading">Today's Token Report</h2>
          <button onClick={onClose} className="text-muted hover:text-heading transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <p className="text-sm text-muted">{report.date}</p>

          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Total Created" value={report.total} icon={<Ticket className="w-5 h-5 text-primary" />} />
            <StatTile label="Completed" value={report.completed} icon={<CheckCircle2 className="w-5 h-5 text-secondary" />} />
            <StatTile label="Pending" value={report.pending} icon={<Clock className="w-5 h-5 text-amber-500" />} />
            <StatTile label="Completion Rate" value={`${completionRate}%`} icon={<TrendingUp className="w-5 h-5 text-primary" />} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-heading mb-2">Gender Breakdown</h3>
            <div className="space-y-1.5">
              {Object.entries(report.genderCounts).length === 0 ? (
                <p className="text-sm text-muted">No data</p>
              ) : (
                Object.entries(report.genderCounts).map(([gender, count]) => (
                  <div key={gender} className="flex items-center justify-between text-sm">
                    <span className="text-body">{gender}</span>
                    <span className="font-semibold text-heading">{count}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-heading mb-2">Pending Token Numbers</h3>
            {report.pendingTokenNumbers.length === 0 ? (
              <p className="text-sm text-muted">None — all tokens completed.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {report.pendingTokenNumbers.map((n) => (
                  <span key={n} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                    #{n}
                  </span>
                ))}
              </div>
            )}
          </div>

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
            <Button variant="primary" size="lg" className="w-full" icon={<MessageCircle className="w-5 h-5" />}>
              Send to Doctor via WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

function StatTile({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) {
  return (
    <div className="bg-background rounded-xl p-3 flex items-center gap-3">
      <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold text-heading leading-none">{value}</p>
        <p className="text-xs text-muted mt-1">{label}</p>
      </div>
    </div>
  );
}
