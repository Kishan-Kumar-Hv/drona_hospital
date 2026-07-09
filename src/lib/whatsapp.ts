export const DOCTOR_WHATSAPP_NUMBER = '919986492170';

export interface TokenReport {
  date: string;
  total: number;
  completed: number;
  pending: number;
  genderCounts: Record<string, number>;
  pendingTokenNumbers: number[];
}

export function buildTokenReportMessage(report: TokenReport): string {
  const completionRate = report.total === 0 ? 0 : Math.round((report.completed / report.total) * 100);

  const genderLines =
    Object.entries(report.genderCounts)
      .map(([gender, count]) => `- ${gender}: ${count}`)
      .join('\n') || '- No data';

  const pendingLine =
    report.pendingTokenNumbers.length > 0
      ? report.pendingTokenNumbers.map((n) => `#${n}`).join(', ')
      : 'None';

  return [
    '*Drona Healthcare Services - Daily Token Report*',
    `Date: ${report.date}`,
    '',
    `Total Tokens Issued: ${report.total}`,
    `Completed: ${report.completed}`,
    `Pending: ${report.pending}`,
    `Completion Rate: ${completionRate}%`,
    '',
    'Gender Breakdown:',
    genderLines,
    '',
    `Pending Token Numbers: ${pendingLine}`,
  ].join('\n');
}

export function getWhatsappShareUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
