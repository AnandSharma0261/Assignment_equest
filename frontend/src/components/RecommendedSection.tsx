import Link from 'next/link';
import type { Job } from '@/lib/types';
import TagPill, { toneForJobType } from './TagPill';
import { companyInitials, formatSalaryRange, prettyJobType } from '@/lib/format';

export default function RecommendedSection({ items }: { items: Job[] }) {
  if (!items.length) return null;
  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold text-ink">Recommended for You</h2>
          <p className="text-base text-[color:var(--color-ink-muted)]">
            Based on your recent applications and profile skills.
          </p>
        </div>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1 text-base font-semibold text-[color:var(--color-brand-700)] hover:underline"
        >
          View all recommendations
          <svg viewBox="0 0 10 10" className="h-[10px] w-[10px]" fill="none" aria-hidden="true">
            <path d="M2 5h6m0 0-3-3m3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((job) => (
          <RecommendCard key={job._id} job={job} />
        ))}
      </div>
    </section>
  );
}

function RecommendCard({ job }: { job: Job }) {
  const salary = formatSalaryRange(job.salaryMin, job.salaryMax, job.salaryCurrency);
  return (
    <article
      className="flex flex-col gap-4 rounded-[12px] bg-white p-6"
      style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[color:var(--color-bg-subtle)] text-xs font-bold text-[color:var(--color-ink-muted)]">
          {companyInitials(job.company)}
        </div>
        <button
          type="button"
          aria-label="Save role"
          className="text-[color:var(--color-ink-muted)] transition-colors hover:text-[color:var(--color-brand-700)]"
        >
          <svg viewBox="0 0 14 18" className="h-[18px] w-[14px]" fill="none" aria-hidden="true">
            <path
              d="M1 1.75A.75.75 0 0 1 1.75 1h10.5a.75.75 0 0 1 .75.75v15.25L7 13.5 1 17V1.75Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div>
        <h3 className="text-lg font-bold text-ink">{job.title}</h3>
        <p className="text-xs text-[color:var(--color-ink-muted)]">
          {job.company} • {job.location}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <TagPill tone={toneForJobType(job.jobType)} uppercase={false}>
          {prettyJobType(job.jobType)}
        </TagPill>
        {salary && (
          <TagPill tone="blue" uppercase={false}>
            {salary}
          </TagPill>
        )}
      </div>

      <Link
        href={`/jobs/${job._id}`}
        className="mt-auto inline-flex items-center justify-center rounded-[8px] border border-[color:var(--color-brand-700)] px-4 py-2 text-base font-semibold text-[color:var(--color-brand-700)] transition-colors hover:bg-[color:var(--color-brand-700)] hover:text-white"
      >
        Quick Apply
      </Link>
    </article>
  );
}
