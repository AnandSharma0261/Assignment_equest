export function formatRelativeTime(iso: string | Date): string {
  const date = typeof iso === 'string' ? new Date(iso) : iso;
  const diffMs = date.getTime() - Date.now();
  const diffSec = Math.round(diffMs / 1000);
  const abs = Math.abs(diffSec);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (abs < 45) return 'just now';
  if (abs < 90) return rtf.format(Math.round(diffSec / 60), 'minute');
  if (abs < 45 * 60) return rtf.format(Math.round(diffSec / 60), 'minute');
  if (abs < 90 * 60) return rtf.format(Math.round(diffSec / 3600), 'hour');
  if (abs < 22 * 3600) return rtf.format(Math.round(diffSec / 3600), 'hour');
  if (abs < 36 * 3600) return rtf.format(Math.round(diffSec / 86400), 'day');
  if (abs < 26 * 86400) return rtf.format(Math.round(diffSec / 86400), 'day');
  if (abs < 45 * 86400) return rtf.format(Math.round(diffSec / (7 * 86400)), 'week');
  if (abs < 320 * 86400) return rtf.format(Math.round(diffSec / (30 * 86400)), 'month');
  return rtf.format(Math.round(diffSec / (365 * 86400)), 'year');
}

export function formatSalaryRange(
  min?: number,
  max?: number,
  currency = 'INR',
): string | null {
  if (!min && !max) return null;
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₹';
  const fmt = (n: number) => {
    if (currency === 'INR') {
      if (n >= 100000) return `${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
      return n.toLocaleString('en-IN');
    }
    if (n >= 1000) return `${Math.round(n / 1000)}k`;
    return n.toLocaleString();
  };
  if (min && max) return `${symbol}${fmt(min)} - ${symbol}${fmt(max)}`;
  if (min) return `${symbol}${fmt(min)}+`;
  return `Up to ${symbol}${fmt(max!)}`;
}

export function companyInitials(company: string): string {
  return company
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function prettyJobType(t: string): string {
  return t
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join('-');
}
