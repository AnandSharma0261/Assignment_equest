import Link from 'next/link';
import type { Job } from '@/lib/types';
import TagPill, { toneForJobType } from './TagPill';
import {
  companyInitials,
  formatRelativeTime,
  formatSalaryRange,
  prettyJobType,
} from '@/lib/format';

export default function JobCard({ job }: { job: Job }) {
  const salary = formatSalaryRange(job.salaryMin, job.salaryMax, job.salaryCurrency);

  return (
    <article className="flex flex-col rounded-[8px] bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-8px_rgba(15,23,42,0.08)]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-[12px] bg-[color:var(--color-hero)] text-base font-bold text-[color:var(--color-ink-muted)]">
          {companyInitials(job.company)}
        </div>
        <button
          type="button"
          aria-label="Save job"
          className="text-[color:var(--color-icon-muted)] transition-colors hover:text-[color:var(--color-brand-700)]"
        >
          <BookmarkIcon />
        </button>
      </div>

      <h3 className="mb-2 text-base font-bold leading-6 text-ink">{job.title}</h3>

      <p className="mb-4 text-base font-medium leading-6 text-[color:var(--color-ink-muted)]">
        {job.company} • {job.location}
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        <TagPill tone={toneForJobType(job.jobType)}>{prettyJobType(job.jobType)}</TagPill>
        {job.status === 'closed' && <TagPill tone="gray">Closed</TagPill>}
        {salary && <TagPill tone="gray" uppercase={false}>{salary}</TagPill>}
      </div>

      <p className="mb-6 line-clamp-3 text-base leading-[26px] text-[color:var(--color-ink-muted)]">
        {job.description}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-[color:var(--color-hero)] pt-4">
        <span className="text-base text-[color:var(--color-icon-muted)]">
          {formatRelativeTime(job.createdAt)}
        </span>
        <Link
          href={`/jobs/${job._id}`}
          className="inline-flex items-center gap-1 text-base font-bold text-[color:var(--color-brand-700)] hover:underline"
        >
          View details
          <ArrowRight />
        </Link>
      </div>
    </article>
  );
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 14 18" className="h-[18px] w-[14px]" fill="none" aria-hidden="true">
      <path
        d="M1 1.75A.75.75 0 0 1 1.75 1h10.5a.75.75 0 0 1 .75.75v15.25L7 13.5 1 17V1.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden="true">
      <path
        d="M2.5 6h7m0 0-3-3m3 3-3 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
