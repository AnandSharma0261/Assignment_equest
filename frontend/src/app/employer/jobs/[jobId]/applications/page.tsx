import { redirect, notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ApplicationsFooter from '@/components/ApplicationsFooter';
import BackLink from '@/components/Breadcrumb';
import StatsBento from '@/components/StatsBento';
import TagPill, { toneForJobType } from '@/components/TagPill';
import StatusDropdown from '@/components/StatusDropdown';
import CloseJobButton from '@/components/CloseJobButton';
import { api, ApiError } from '@/lib/api';
import { formatRelativeTime, prettyJobType } from '@/lib/format';
import type { Application, User } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function readCookieHeader(): Promise<string> {
  const store = await cookies();
  const token = store.get('jb_token')?.value;
  return token ? `jb_token=${token}` : '';
}

type AppWithSeeker = Omit<Application, 'seeker'> & { seeker: User };

export default async function JobApplicationsPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const cookieHeader = await readCookieHeader();
  if (!cookieHeader) {
    redirect(`/login?role=employer&next=/employer/jobs/${jobId}/applications`);
  }

  let user;
  try {
    ({ user } = await api.me(cookieHeader));
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect(`/login?role=employer&next=/employer/jobs/${jobId}/applications`);
    }
    throw err;
  }

  if (user.role !== 'employer') redirect('/employer');

  let job;
  try {
    job = await api.getJob(jobId, { cache: 'no-store' });
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const postedById = typeof job.postedBy === 'object' ? job.postedBy?._id : job.postedBy;
  if (postedById !== user.id) {
    return <WrongOwnerGate />;
  }

  let apps: Application[] = [];
  try {
    const res = await api.applicationsForJob(jobId, cookieHeader);
    apps = res.items;
  } catch (err) {
    if (err instanceof ApiError && err.status === 403) {
      return <WrongOwnerGate />;
    }
    throw err;
  }

  const resolved = apps.filter(
    (a): a is AppWithSeeker => typeof a.seeker === 'object' && a.seeker !== null,
  );

  const counts = {
    total: resolved.length,
    applied: resolved.filter((a) => a.status === 'applied').length,
    shortlisted: resolved.filter((a) => a.status === 'shortlisted').length,
    hired: resolved.filter((a) => a.status === 'hired').length,
    rejected: resolved.filter((a) => a.status === 'rejected').length,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-12 md:px-12 md:pt-16">
        <div className="mb-6">
          <BackLink href="/employer" label="Back to your roles" />
        </div>

        <section className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <TagPill tone={toneForJobType(job.jobType)}>
                {prettyJobType(job.jobType)}
              </TagPill>
              {job.status === 'open' ? (
                <TagPill tone="green">Open</TagPill>
              ) : (
                <TagPill tone="gray">Closed</TagPill>
              )}
            </div>
            <h1
              className="text-[32px] font-bold leading-tight text-ink sm:text-[40px] sm:leading-[50px]"
              style={{ letterSpacing: '-1.1px' }}
            >
              Candidates for {job.title}
            </h1>
            <p className="text-base text-[color:var(--color-ink-muted)]">
              {job.company} • {job.location} • Posted {formatRelativeTime(job.createdAt)}
            </p>
          </div>
          <CloseJobButton jobId={job._id} closed={job.status === 'closed'} />
        </section>

        <section className="mt-10">
          <StatsBento
            stats={[
              { label: 'New', value: String(counts.applied).padStart(2, '0'), hint: counts.applied ? 'Needs review' : 'No new apps', hintTone: 'blue' },
              { label: 'Shortlisted', value: String(counts.shortlisted).padStart(2, '0'), hint: counts.shortlisted ? 'Advancing' : '—', hintTone: 'green' },
              { label: 'Offers', value: String(counts.hired).padStart(2, '0'), hint: counts.hired ? 'Extended' : '—', hintTone: 'amber' },
            ]}
            profile={{ value: counts.total, label: `Total Candidates` }}
          />
        </section>

        <section className="mt-10">
          {resolved.length === 0 ? (
            <EmptyState />
          ) : (
            <div
              className="overflow-hidden rounded-[12px] bg-white"
              style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}
            >
              <div className="hidden md:block">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[color:var(--color-toggle)] text-left">
                      <Th className="pl-8">Candidate</Th>
                      <Th>Applied</Th>
                      <Th>Cover Letter</Th>
                      <Th className="pr-8">Status</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {resolved.map((a) => (
                      <Row key={a._id} app={a} />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-4 p-4 md:hidden">
                {resolved.map((a) => (
                  <MobileRow key={a._id} app={a} />
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

function Th({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-8 py-4 text-left text-xs font-semibold uppercase tracking-[0.6px] text-[color:var(--color-ink-muted)] ${className}`}
    >
      {children}
    </th>
  );
}

function Row({ app }: { app: AppWithSeeker }) {
  return (
    <tr className="border-t border-[color:var(--color-hero)] align-top">
      <td className="pl-8 pr-8 py-6">
        <p className="text-lg font-semibold text-ink">{app.seeker.name}</p>
        <a
          href={`mailto:${app.seeker.email}`}
          className="text-xs text-[color:var(--color-ink-muted)] hover:text-ink"
        >
          {app.seeker.email}
        </a>
      </td>
      <td className="px-8 py-6 text-base text-[color:var(--color-ink-muted)]">
        {formatRelativeTime(app.createdAt)}
      </td>
      <td className="px-8 py-6 text-base text-[color:var(--color-ink-muted)]">
        {app.coverLetter ? (
          <p className="max-w-sm whitespace-pre-wrap leading-[26px] line-clamp-3">
            {app.coverLetter}
          </p>
        ) : (
          <span className="italic">No cover letter</span>
        )}
      </td>
      <td className="pr-8 py-6">
        <StatusDropdown applicationId={app._id} initial={app.status} />
      </td>
    </tr>
  );
}

function MobileRow({ app }: { app: AppWithSeeker }) {
  return (
    <div className="flex flex-col gap-3 rounded-[8px] border border-[color:var(--color-border-faint)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-ink">{app.seeker.name}</p>
          <a
            href={`mailto:${app.seeker.email}`}
            className="truncate text-xs text-[color:var(--color-ink-muted)]"
          >
            {app.seeker.email}
          </a>
        </div>
        <StatusDropdown applicationId={app._id} initial={app.status} />
      </div>
      {app.coverLetter && (
        <p className="line-clamp-3 text-sm leading-[22px] text-[color:var(--color-ink-muted)]">
          {app.coverLetter}
        </p>
      )}
      <p className="text-xs text-[color:var(--color-ink-muted)]">
        Applied {formatRelativeTime(app.createdAt)}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center gap-2 rounded-[12px] bg-white px-6 py-16 text-center"
      style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}
    >
      <p className="text-lg font-bold text-ink">No candidates yet</p>
      <p className="text-base text-[color:var(--color-ink-muted)]">
        Applications will show up here as soon as seekers apply to this role.
      </p>
    </div>
  );
}

function WrongOwnerGate() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div
          className="max-w-md rounded-[12px] bg-white p-10 text-center"
          style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}
        >
          <h1 className="text-2xl font-bold text-ink">Not your role</h1>
          <p className="mt-2 text-base text-[color:var(--color-ink-muted)]">
            Only the employer who posted a role can review its applications.
          </p>
          <Link
            href="/employer"
            className="cta-gradient mt-6 inline-flex items-center justify-center rounded-[8px] px-6 py-3 text-base font-semibold text-white"
          >
            Back to your roles
          </Link>
        </div>
      </main>
      <ApplicationsFooter />
    </div>
  );
}
