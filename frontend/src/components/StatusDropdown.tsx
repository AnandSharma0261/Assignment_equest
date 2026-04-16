'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import type { ApplicationStatus } from '@/lib/types';

const OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: 'applied', label: 'Applied' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'hired', label: 'Hired' },
];

const TONE: Record<ApplicationStatus, string> = {
  applied: 'bg-[color:var(--color-tag-gray-bg)] text-[color:var(--color-tag-gray-fg)]',
  shortlisted: 'bg-[color:var(--color-tag-blue-bg)] text-[color:var(--color-tag-blue-fg)]',
  rejected: 'bg-[color:var(--color-tag-red-bg)] text-[color:var(--color-tag-red-fg)]',
  hired: 'bg-[color:var(--color-tag-amber-bg)] text-[color:var(--color-tag-amber-fg)]',
};

export default function StatusDropdown({
  applicationId,
  initial,
}: {
  applicationId: string;
  initial: ApplicationStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<ApplicationStatus>(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function update(next: ApplicationStatus) {
    if (next === status) return;
    const prev = status;
    setStatus(next);
    setError(null);
    try {
      await api.updateApplicationStatus(applicationId, next);
      startTransition(() => router.refresh());
    } catch (err) {
      setStatus(prev);
      setError(err instanceof ApiError ? err.message : 'Update failed');
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="relative">
        <select
          value={status}
          onChange={(e) => update(e.target.value as ApplicationStatus)}
          disabled={pending}
          aria-label="Application status"
          className={`cursor-pointer appearance-none rounded-full px-3 pr-8 py-1 text-xs font-semibold outline-none transition-opacity focus:ring-2 focus:ring-[color:var(--color-brand-600)]/30 disabled:opacity-60 ${TONE[status]}`}
        >
          {OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="text-ink">
              {o.label}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 10 6"
          className="pointer-events-none absolute right-2 top-1/2 h-2 w-2.5 -translate-y-1/2 opacity-70"
          fill="none"
          aria-hidden="true"
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      {error && <span className="text-xs text-[color:var(--color-danger)]">{error}</span>}
    </div>
  );
}
