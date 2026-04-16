import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import DetailFooter from '@/components/DetailFooter';
import BottomNavBar from '@/components/BottomNavBar';
import BackLink from '@/components/Breadcrumb';
import ApplyCard from '@/components/ApplyCard';
import CompanyCard from '@/components/CompanyCard';
import TagPill, { toneForJobType } from '@/components/TagPill';
import { api, ApiError } from '@/lib/api';
import { companyInitials, prettyJobType } from '@/lib/format';
import type { Job } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let job: Job;
  try {
    job = await api.getJob(id, { cache: 'no-store' });
  } catch (err) {
    if (err instanceof ApiError && (err.status === 404 || err.status === 400)) {
      notFound();
    }
    throw err;
  }

  const paragraphs = job.description.split(/\n{2,}/).filter(Boolean);
  const initials = companyInitials(job.company);

  return (
    <div className="flex min-h-screen flex-col pb-16 md:pb-0">
      <Navbar />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-12 md:px-12 md:pt-16">
        <div className="mb-8">
          <BackLink href="/jobs" label="Back to all listings" />
        </div>

        <div className="flex flex-col gap-12 lg:flex-row">
          <div className="flex min-w-0 flex-1 flex-col gap-10">
            <header className="flex flex-col items-start gap-6 sm:flex-row">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[20px] bg-[#E0E3E5] text-xl font-bold text-[color:var(--color-ink-muted)]">
                {initials}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <TagPill tone={toneForJobType(job.jobType)}>
                    {prettyJobType(job.jobType)}
                  </TagPill>
                  {job.industry && <TagPill tone="green">{job.industry}</TagPill>}
                  {job.status === 'closed' && <TagPill tone="gray">Closed</TagPill>}
                </div>

                <h1
                  className="text-[36px] font-bold leading-[44px] text-ink sm:text-[44px] sm:leading-[55px]"
                  style={{ letterSpacing: '-1.1px' }}
                >
                  {job.title}
                </h1>

                <p className="flex items-center gap-2 text-xl font-medium text-[color:var(--color-ink-muted)]">
                  {job.company}
                  <span className="inline-block h-1 w-1 rounded-full bg-[color:var(--color-border-solid)]" />
                  {job.location}
                </p>
              </div>
            </header>

            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-ink">The Opportunity</h2>
              <div className="flex flex-col gap-4">
                {paragraphs.map((p, i) => (
                  <p key={i} className="text-lg leading-[29px] text-[color:var(--color-ink-muted)]">
                    {p}
                  </p>
                ))}
              </div>
            </section>

            {job.requirements && job.requirements.length > 0 && (
              <section className="flex flex-col gap-6 rounded-[20px] bg-[color:var(--color-toggle)] p-8">
                <h2 className="text-xl font-semibold text-ink">What you&apos;ll bring</h2>
                <ul className="flex flex-col gap-4">
                  {job.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckIcon />
                      <span className="flex-1 text-base leading-6 text-[color:var(--color-ink-muted)]">
                        {r}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {job.aboutTeam && (
              <section className="flex flex-col gap-6">
                <h2 className="text-xl font-semibold text-ink">The Team Culture</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="aspect-[361/192] overflow-hidden rounded-[20px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=640&fit=crop&auto=format&q=80"
                      alt="Team collaborating around a table"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="aspect-[361/192] overflow-hidden rounded-[20px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=640&fit=crop&auto=format&q=80"
                      alt="Colleagues working together in a bright office"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
                <p className="text-lg leading-[29px] text-[color:var(--color-ink-muted)]">
                  {job.aboutTeam}
                </p>
              </section>
            )}
          </div>

          <div className="w-full lg:w-[397px] lg:shrink-0">
            <div className="flex flex-col gap-6">
              <ApplyCard job={job} />
              <CompanyCard job={job} />
            </div>
          </div>
        </div>
      </main>

      <DetailFooter />

      <BottomNavBar />
    </div>
  );
}

function CheckIcon() {
  return (
    <span
      className="mt-[2px] inline-flex h-5 w-5 shrink-0 items-center justify-center text-[color:var(--color-brand-700)]"
      aria-hidden="true"
    >
      <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none">
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="m6 10 3 3 5-6"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
