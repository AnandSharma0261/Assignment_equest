'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Job } from '@/lib/types';
import { useAuth } from '@/lib/useAuth';
import { api, ApiError } from '@/lib/api';
import { formatRelativeTime, formatSalaryRange } from '@/lib/format';

type ApplyState = 'idle' | 'dialog' | 'submitting' | 'success' | 'already';

export default function ApplyCard({ job }: { job: Job }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [state, setState] = useState<ApplyState>('idle');
  const [coverLetter, setCoverLetter] = useState('');
  const [error, setError] = useState<string | null>(null);

  const salary = formatSalaryRange(job.salaryMin, job.salaryMax, job.salaryCurrency);
  const closed = job.status === 'closed';

  function handleApplyClick() {
    setError(null);
    if (!user) {
      router.push(`/login?role=seeker&next=/jobs/${job._id}`);
      return;
    }
    if (user.role !== 'seeker') {
      setError('Only job seekers can apply for roles.');
      return;
    }
    setState('dialog');
  }

  async function submitApplication() {
    setState('submitting');
    setError(null);
    try {
      await api.apply({ jobId: job._id, coverLetter: coverLetter.trim() || undefined });
      setState('success');
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setState('already');
        return;
      }
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
      setState('dialog');
    }
  }

  return (
    <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
      <div
        className="flex flex-col gap-8 rounded-[20px] bg-white p-8"
        style={{
          boxShadow:
            '0 0 0 1px rgba(195, 198, 215, 0.15), 0 12px 32px -4px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div className="flex flex-col gap-1">
          <p className="text-base font-medium text-[color:var(--color-ink-faint)]">
            {salary ? 'Competitive Salary' : 'Compensation'}
          </p>
          <p className="flex items-baseline gap-2 text-2xl font-bold text-ink">
            {salary || '—'}
            {salary && (
              <span className="text-sm font-medium text-[#94A3B8]">/ year</span>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {state === 'success' ? (
            <SuccessBanner />
          ) : state === 'already' ? (
            <AlreadyBanner />
          ) : closed ? (
            <ClosedBanner />
          ) : state === 'dialog' ? (
            <InlineApplyForm
              coverLetter={coverLetter}
              setCoverLetter={setCoverLetter}
              onSubmit={submitApplication}
              onCancel={() => setState('idle')}
              submitting={false}
              error={error}
            />
          ) : state === 'submitting' ? (
            <InlineApplyForm
              coverLetter={coverLetter}
              setCoverLetter={setCoverLetter}
              onSubmit={submitApplication}
              onCancel={() => setState('idle')}
              submitting
              error={null}
            />
          ) : (
            <>
              <button
                type="button"
                onClick={handleApplyClick}
                disabled={authLoading}
                className="cta-gradient inline-flex h-14 items-center justify-center gap-2 rounded-[16px] text-base font-bold text-white transition-transform hover:brightness-105 active:scale-[0.99] disabled:opacity-70"
              >
                Apply for this position
                <ExternalIcon />
              </button>
              <button
                type="button"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-[16px] bg-[color:var(--color-button-soft)] text-base font-semibold text-ink transition-colors hover:brightness-95"
              >
                <BookmarkIcon />
                Save for Later
              </button>
              {error && (
                <p className="text-sm text-[color:var(--color-danger)]">{error}</p>
              )}
            </>
          )}
        </div>

        <dl className="flex flex-col gap-4 border-t border-[#F1F5F9] pt-6">
          <Row label="Posted" value={formatRelativeTime(job.createdAt)} />
          <Row
            label="Applicants"
            value={
              typeof job.applicantCount === 'number'
                ? `${job.applicantCount} ${job.applicantCount === 1 ? 'Candidate' : 'Candidates'}`
                : '—'
            }
          />
          <Row label="Status" value={job.status === 'closed' ? 'Closed' : 'Open'} />
        </dl>
      </div>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-sm text-[color:var(--color-ink-faint)]">{label}</dt>
      <dd className="text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}

function InlineApplyForm({
  coverLetter,
  setCoverLetter,
  onSubmit,
  onCancel,
  submitting,
  error,
}: {
  coverLetter: string;
  setCoverLetter: (v: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitting: boolean;
  error: string | null;
}) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-[color:var(--color-ink-muted)]">
        Cover letter <span className="font-normal text-[color:var(--color-ink-faint)]">(optional)</span>
      </label>
      <textarea
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
        rows={5}
        placeholder="A short note on why you're a great fit…"
        className="w-full rounded-[12px] border border-[color:var(--color-border)] bg-white p-4 text-sm outline-none transition-all focus:border-[color:var(--color-brand-600)] focus:ring-2 focus:ring-[color:var(--color-brand-600)]/20"
        disabled={submitting}
      />
      {error && <p className="text-sm text-[color:var(--color-danger)]">{error}</p>}
      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting}
        className="cta-gradient inline-flex h-12 items-center justify-center rounded-[16px] text-base font-bold text-white disabled:opacity-70"
      >
        {submitting ? 'Submitting…' : 'Submit application'}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={submitting}
        className="text-sm font-medium text-[color:var(--color-ink-muted)] hover:text-ink"
      >
        Cancel
      </button>
    </div>
  );
}

function SuccessBanner() {
  return (
    <div className="flex flex-col gap-2 rounded-[16px] bg-[color:var(--color-tag-green-bg)] p-5 text-[color:var(--color-tag-green-fg)]">
      <p className="text-base font-bold">Application sent ✓</p>
      <p className="text-sm">
        The employer has been notified. Track your applications under{' '}
        <Link href="/applications" className="font-semibold underline">
          My Applications
        </Link>
        .
      </p>
    </div>
  );
}

function AlreadyBanner() {
  return (
    <div className="flex flex-col gap-2 rounded-[16px] bg-[color:var(--color-tag-blue-bg)] p-5 text-[color:var(--color-tag-blue-fg)]">
      <p className="text-base font-bold">You already applied</p>
      <p className="text-sm">
        <Link href="/applications" className="font-semibold underline">
          View status in My Applications →
        </Link>
      </p>
    </div>
  );
}

function ClosedBanner() {
  return (
    <div className="rounded-[16px] bg-[color:var(--color-tag-gray-bg)] p-5 text-[color:var(--color-tag-gray-fg)]">
      <p className="text-base font-bold">This role is no longer accepting applications.</p>
    </div>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 14 14" className="h-[13px] w-[13px]" fill="none" aria-hidden="true">
      <path d="M5 2H2v10h10V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 2h4v4m0-4L6 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 12 14" className="h-[13px] w-[10px]" fill="none" aria-hidden="true">
      <path
        d="M1 1.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v11L6 10l-5 2.5v-11Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
