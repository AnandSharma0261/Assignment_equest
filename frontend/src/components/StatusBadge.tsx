import type { ApplicationStatus } from '@/lib/types';
import TagPill from './TagPill';

export const STATUS_UI: Record<
  ApplicationStatus,
  { label: string; tone: 'green' | 'blue' | 'amber' | 'gray' | 'red' }
> = {
  applied: { label: 'Applied', tone: 'gray' },
  shortlisted: { label: 'Reviewing', tone: 'blue' },
  rejected: { label: 'Not Selected', tone: 'red' },
  hired: { label: 'Offer Received', tone: 'amber' },
};

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
  const s = STATUS_UI[status];
  return (
    <TagPill tone={s.tone} uppercase={false}>
      {s.label}
    </TagPill>
  );
}

export function InterviewCell({ status }: { status: ApplicationStatus }) {
  switch (status) {
    case 'hired':
      return (
        <span className="inline-flex items-center gap-2 text-base font-medium text-[color:var(--color-success)]">
          <CheckCircle />
          Completed
        </span>
      );
    case 'shortlisted':
      return (
        <span className="inline-flex items-center gap-2 text-base text-[color:var(--color-brand-700)]">
          <CalendarIcon />
          Under review
        </span>
      );
    case 'rejected':
      return <span className="text-base italic text-[color:var(--color-ink-muted)]">Closed</span>;
    case 'applied':
    default:
      return <span className="text-base italic text-[color:var(--color-ink-muted)]">No updates</span>;
  }
}

function CheckCircle() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="currentColor" />
      <path
        d="m4.5 8 2.5 2.5 4-5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 14 16" className="h-4 w-[14px]" fill="none" aria-hidden="true">
      <rect x="1" y="3" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 1v3M10 1v3M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
