'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';

export default function CloseJobButton({
  jobId,
  closed,
}: {
  jobId: string;
  closed: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleClose() {
    if (closed) return;
    if (!confirm('Close this role and stop accepting applications?')) return;
    setError(null);
    try {
      await api.closeJob(jobId);
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to close');
    }
  }

  if (closed) {
    return (
      <span className="inline-flex items-center rounded-[8px] bg-[color:var(--color-tag-gray-bg)] px-4 py-2 text-sm font-semibold text-[color:var(--color-tag-gray-fg)]">
        Role closed
      </span>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleClose}
        disabled={pending}
        className="rounded-[8px] bg-[color:var(--color-button-soft)] px-4 py-2 text-sm font-semibold text-ink transition-colors hover:brightness-95 disabled:opacity-60"
      >
        {pending ? 'Closing…' : 'Close role'}
      </button>
      {error && <span className="text-xs text-[color:var(--color-danger)]">{error}</span>}
    </div>
  );
}
