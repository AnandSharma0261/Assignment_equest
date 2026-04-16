import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ApplicationsFooter from '@/components/ApplicationsFooter';
import StatsBento from '@/components/StatsBento';
import TagPill, { toneForJobType } from '@/components/TagPill';
import { api, ApiError } from '@/lib/api';
import { companyInitials, formatRelativeTime, prettyJobType } from '@/lib/format';
import type { Job } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function readCookieHeader(): Promise<string> {
  const store = await cookies();
  const token = store.get('jb_token')?.value;
  return token ? `jb_token=${token}` : '';
}

export default async function EmployerDashboard() {
  const cookieHeader = await readCookieHeader();
  if (!cookieHeader) redirect('/login?role=employer&next=/employer');

  let user;
  try {
    ({ user } = await api.me(cookieHeader));
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect('/login?role=employer&next=/employer');
    }
    throw err;
  }

  if (user.role !== 'employer') {
    return <NotEmployerGate />;
  }

  const { items: jobs } = await api.myPostedJobs(cookieHeader);

  const countsArr = await Promise.all(
    jobs.map(async (j) => {
      try {
        const d = await api.getJob(j._id, { cache: 'no-store' });
        return { jobId: j._id, count: d.applicantCount ?? 0 };
      } catch {
        return { jobId: j._id, count: 0 };
      }
    }),
  );
  const counts = new Map(countsArr.map((c) => [c.jobId, c.count]));

  const total = jobs.length;
  const openCount = jobs.filter((j) => j.status === 'open').length;
  const closedCount = jobs.filter((j) => j.status === 'closed').length;
  const totalApps = countsArr.reduce((s, c) => s + c.count, 0);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-12 md:px-12 md:pt-16">
        <section className="flex flex-col">
          <h1
            className="text-[36px] font-bold leading-tight text-ink sm:text-[44px] sm:leading-[53px]"
            style={{ letterSpacing: '-1.1px' }}
          >
            Your Roles
          </h1>
          <p className="mt-2 max-w-[672px] text-base leading-[26px] text-[color:var(--color-ink-muted)]">
            Manage postings, review applicants, and move candidates through your
            hiring pipeline.
          </p>
        </section>

        <section className="mt-12">
          <StatsBento
            stats={[
              { label: 'Total Roles', value: String(total).padStart(2, '0'), hint: `${user.company || ''}`, hintTone: 'blue' },
              { label: 'Open', value: String(openCount).padStart(2, '0'), hint: openCount ? 'Accepting apps' : '—', hintTone: 'green' },
              { label: 'Closed', value: String(closedCount).padStart(2, '0'), hint: closedCount ? 'Archived' : '—', hintTone: 'amber' },
            ]}
            profile={{
              value: Math.min(100, totalApps),
              label: `Candidates • ${totalApps} total`,
            }}
          />
        </section>

        <section className="mt-12">
          {total === 0 ? (
            <EmptyRoles />
          ) : (
            <div
              className="overflow-hidden rounded-[12px] bg-white"
              style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}
            >
              <div className="hidden md:block">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[color:var(--color-toggle)] text-left">
                      <th className="py-4 pl-8 pr-4 text-xs font-semibold uppercase tracking-[0.6px] text-[color:var(--color-ink-muted)]">Role</th>
                      <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.6px] text-[color:var(--color-ink-muted)]">Posted</th>
                      <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.6px] text-[color:var(--color-ink-muted)]">Type</th>
                      <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.6px] text-[color:var(--color-ink-muted)]">Applications</th>
                      <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.6px] text-[color:var(--color-ink-muted)]">Status</th>
                      <th className="py-4 pl-4 pr-8 text-right text-xs font-semibold uppercase tracking-[0.6px] text-[color:var(--color-ink-muted)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((j) => (
                      <JobRow key={j._id} job={j} apps={counts.get(j._id) ?? 0} />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 p-4 md:hidden">
                {jobs.map((j) => (
                  <MobileRoleCard key={j._id} job={j} apps={counts.get(j._id) ?? 0} />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <ApplicationsFooter />
    </div>
  );
}

function JobRow({ job, apps }: { job: Job; apps: number }) {
  return (
    <tr className="border-t border-[color:var(--color-hero)]">
      <td className="pl-8 pr-4 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#F1F5F9] text-sm font-bold text-[color:var(--color-ink-muted)]">
            {companyInitials(job.company)}
          </div>
          <div>
            <Link
              href={`/jobs/${job._id}`}
              className="block text-lg font-semibold text-ink hover:text-[color:var(--color-brand-700)]"
            >
              {job.title}
            </Link>
            <p className="text-xs text-[color:var(--color-ink-muted)]">
              {job.company} • {job.location}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-5 text-base text-[color:var(--color-ink-muted)]">
        {formatRelativeTime(job.createdAt)}
      </td>
      <td className="px-4 py-5">
        <TagPill tone={toneForJobType(job.jobType)}>{prettyJobType(job.jobType)}</TagPill>
      </td>
      <td className="px-4 py-5">
        <span className="text-base font-semibold text-ink">{apps}</span>
        <span className="ml-1 text-base text-[color:var(--color-ink-muted)]">
          {apps === 1 ? 'candidate' : 'candidates'}
        </span>
      </td>
      <td className="px-4 py-5">
        {job.status === 'open' ? (
          <TagPill tone="green">Open</TagPill>
        ) : (
          <TagPill tone="gray">Closed</TagPill>
        )}
      </td>
      <td className="pl-4 pr-8 py-5 text-right">
        <Link
          href={`/employer/jobs/${job._id}/applications`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--color-brand-700)] hover:underline"
        >
          Manage
          <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" fill="none" aria-hidden="true">
            <path d="M2 5h6m0 0-3-3m3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </td>
    </tr>
  );
}

function MobileRoleCard({ job, apps }: { job: Job; apps: number }) {
  return (
    <div className="flex flex-col gap-3 rounded-[8px] border border-[color:var(--color-border-faint)] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#F1F5F9] text-xs font-bold text-[color:var(--color-ink-muted)]">
          {companyInitials(job.company)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-ink">{job.title}</p>
          <p className="truncate text-xs text-[color:var(--color-ink-muted)]">
            {job.location} • {apps} {apps === 1 ? 'candidate' : 'candidates'}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        {job.status === 'open' ? (
          <TagPill tone="green">Open</TagPill>
        ) : (
          <TagPill tone="gray">Closed</TagPill>
        )}
        <Link
          href={`/employer/jobs/${job._id}/applications`}
          className="text-sm font-semibold text-[color:var(--color-brand-700)]"
        >
          Manage →
        </Link>
      </div>
    </div>
  );
}

function EmptyRoles() {
  return (
    <div
      className="flex flex-col items-center gap-3 rounded-[12px] bg-white px-6 py-16 text-center"
      style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}
    >
      <p className="text-xl font-bold text-ink">You haven&apos;t posted any roles yet</p>
      <p className="max-w-md text-base text-[color:var(--color-ink-muted)]">
        Create your first posting and start receiving applications from curated
        candidates.
      </p>
      <Link
        href="/employer/post"
        className="cta-gradient mt-4 inline-flex items-center justify-center rounded-[8px] px-6 py-3 text-base font-semibold text-white"
      >
        Post a role
      </Link>
    </div>
  );
}

function NotEmployerGate() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div
          className="max-w-md rounded-[12px] bg-white p-10 text-center"
          style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}
        >
          <h1 className="text-2xl font-bold text-ink">Employer account required</h1>
          <p className="mt-2 text-base text-[color:var(--color-ink-muted)]">
            Your Roles is only for employer accounts. Switch to an employer account
            to view your postings.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/register/employer"
              className="cta-gradient inline-flex items-center justify-center rounded-[8px] px-6 py-3 text-base font-semibold text-white"
            >
              Create employer account
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center rounded-[8px] bg-[color:var(--color-button-soft)] px-6 py-3 text-base font-semibold text-ink"
            >
              Back to browsing
            </Link>
          </div>
        </div>
      </main>
      <ApplicationsFooter />
    </div>
  );
}
