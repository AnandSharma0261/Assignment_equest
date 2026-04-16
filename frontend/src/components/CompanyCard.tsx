import type { Job } from '@/lib/types';
import { companyInitials } from '@/lib/format';

export default function CompanyCard({ job }: { job: Job }) {
  const initial = companyInitials(job.company);
  return (
    <div className="rounded-[20px] bg-[color:var(--color-toggle)] p-6">
      <h4 className="mb-4 text-base font-semibold text-ink">About the company</h4>

      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-white text-base font-bold text-[color:var(--color-brand-700)]">
          {initial}
        </div>
        <div>
          <p className="text-base font-bold text-ink">{job.company}</p>
          {job.industry && (
            <p
              className="text-xs font-normal uppercase text-[color:var(--color-ink-faint)]"
              style={{ letterSpacing: '-0.6px' }}
            >
              {job.industry}
            </p>
          )}
        </div>
      </div>

      {job.companyTagline && (
        <p className="mb-2 text-sm leading-[23px] text-[color:var(--color-ink-muted)]">
          {job.companyTagline}
        </p>
      )}

      <button
        type="button"
        className="inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--color-brand-700)] hover:underline"
      >
        View company profile
        <svg viewBox="0 0 6 10" className="h-[10px] w-[6px]" fill="none" aria-hidden="true">
          <path
            d="M1 1l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
