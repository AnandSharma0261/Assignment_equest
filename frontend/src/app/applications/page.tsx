import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ApplicationsFooter from '@/components/ApplicationsFooter';
import BottomNavBar from '@/components/BottomNavBar';
import StatsBento from '@/components/StatsBento';
import ApplicationsTable from '@/components/ApplicationsTable';
import RecommendedSection from '@/components/RecommendedSection';
import { api, ApiError } from '@/lib/api';
import type { Application, Job } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function readCookieHeader(): Promise<string> {
  const store = await cookies();
  const token = store.get(process.env.NEXT_PUBLIC_COOKIE_NAME || 'jb_token')?.value;
  return token ? `jb_token=${token}` : '';
}

export default async function ApplicationsPage() {
  const cookieHeader = await readCookieHeader();
  if (!cookieHeader) redirect('/login?role=seeker&next=/applications');

  let user;
  try {
    ({ user } = await api.me(cookieHeader));
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect('/login?role=seeker&next=/applications');
    }
    throw err;
  }

  if (user.role !== 'seeker') {
    return <NotSeekerGate />;
  }

  const [appsRes, jobsRes] = await Promise.all([
    api.myApplications(cookieHeader),
    api.listJobs({ limit: 6, sort: 'recent' }, { cache: 'no-store' }),
  ]);

  const apps: Application[] = appsRes.items;

  const appliedJobIds = new Set(
    apps
      .map((a) => (typeof a.job === 'object' ? a.job._id : a.job))
      .filter(Boolean),
  );
  const recommended: Job[] = jobsRes.items
    .filter((j) => !appliedJobIds.has(j._id))
    .slice(0, 3);

  const total = apps.length;
  const interviews = apps.filter((a) => a.status === 'shortlisted').length;
  const offers = apps.filter((a) => a.status === 'hired').length;
  const rejections = apps.filter((a) => a.status === 'rejected').length;
  const appsThisWeek = apps.filter((a) => {
    const days = (Date.now() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return days <= 7;
  }).length;

  const profileStrength = Math.min(
    94,
    40 + (user.name ? 15 : 0) + (user.email ? 15 : 0) + Math.min(24, total * 2),
  );

  const industries = new Set(
    apps
      .map((a) => (typeof a.job === 'object' ? a.job.location?.split(',')[0] : null))
      .filter(Boolean),
  );

  return (
    <div className="flex min-h-screen flex-col pb-16 md:pb-0">
      <Navbar />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-12 md:px-12 md:pt-16">
        <section className="flex flex-col gap-2">
          <h1
            className="text-[36px] font-bold leading-tight text-ink sm:text-[44px] sm:leading-[53px]"
            style={{ letterSpacing: '-1.1px' }}
          >
            My Applications
          </h1>
          <p className="max-w-[672px] text-base leading-[26px] text-[color:var(--color-ink-muted)]">
            Track and manage your professional journey. You have{' '}
            {total - rejections} active application{total - rejections === 1 ? '' : 's'} across{' '}
            {industries.size || 1} {industries.size === 1 ? 'industry' : 'industries'}.
          </p>
        </section>

        <section className="mt-12">
          <StatsBento
            stats={[
              {
                label: 'Total Sent',
                value: String(total).padStart(2, '0'),
                hint: appsThisWeek ? `+${appsThisWeek} this week` : 'no new this week',
                hintTone: 'blue',
              },
              {
                label: 'Interviews',
                value: String(interviews).padStart(2, '0'),
                hint: interviews ? `Upcoming: ${interviews}` : '—',
                hintTone: 'green',
              },
              {
                label: 'Offers',
                value: String(offers).padStart(2, '0'),
                hint: offers ? `${offers} Pending` : '—',
                hintTone: 'amber',
              },
            ]}
            profile={{ value: profileStrength, label: 'Profile Strength' }}
          />
        </section>

        <section className="mt-12">
          {total === 0 ? (
            <EmptyApps />
          ) : (
            <ApplicationsTable items={apps} archivedCount={rejections} />
          )}
        </section>

        {recommended.length > 0 && (
          <section className="mt-12">
            <RecommendedSection items={recommended} />
          </section>
        )}
      </main>

      <ApplicationsFooter />

      <BottomNavBar />
    </div>
  );
}

function EmptyApps() {
  return (
    <div
      className="flex flex-col items-center gap-3 rounded-[12px] bg-white px-6 py-16 text-center"
      style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}
    >
      <p className="text-xl font-bold text-ink">No applications yet</p>
      <p className="max-w-md text-base text-[color:var(--color-ink-muted)]">
        Browse the gallery and hit <b>Apply</b> on any role you love — you&apos;ll see
        it tracked here with status updates.
      </p>
      <Link
        href="/jobs"
        className="cta-gradient mt-4 inline-flex items-center justify-center rounded-[8px] px-6 py-3 text-base font-semibold text-white"
      >
        Browse roles
      </Link>
    </div>
  );
}

function NotSeekerGate() {
  return (
    <div className="flex min-h-screen flex-col pb-16 md:pb-0">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div
          className="max-w-md rounded-[12px] bg-white p-10 text-center"
          style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}
        >
          <h1 className="text-2xl font-bold text-ink">Candidate account required</h1>
          <p className="mt-2 text-base text-[color:var(--color-ink-muted)]">
            My Applications is for candidates. Sign in with a candidate account to
            track your applications here.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/register/seeker"
              className="cta-gradient inline-flex items-center justify-center rounded-[8px] px-6 py-3 text-base font-semibold text-white"
            >
              Create candidate account
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

      <BottomNavBar />
    </div>
  );
}
