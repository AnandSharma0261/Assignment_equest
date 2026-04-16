import Navbar from '@/components/Navbar';
import JobsFooter from '@/components/JobsFooter';
import SearchHero from '@/components/SearchHero';
import FiltersSidebar from '@/components/FiltersSidebar';
import JobCard from '@/components/JobCard';
import LoadMore from '@/components/LoadMore';
import { api } from '@/lib/api';
import type { JobListResponse } from '@/lib/types';

export const revalidate = 60;

type SP = { [key: string]: string | string[] | undefined };

function asString(v: string | string[] | undefined): string {
  if (!v) return '';
  return Array.isArray(v) ? v[0] : v;
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const search = asString(sp.search);
  const location = asString(sp.location);
  const jobType = asString(sp.jobType);
  const page = Math.max(1, Number(asString(sp.page)) || 1);
  const limit = Math.min(24, Number(asString(sp.limit)) || 8);
  const sort = asString(sp.sort) === 'oldest' ? 'oldest' : 'recent';

  const initial: JobListResponse = await api.listJobs(
    {
      search,
      location,
      jobType: jobType as never,
      page,
      limit: page * limit,
      sort: sort as 'recent' | 'oldest',
    },
    { next: { revalidate: 60 } },
  );

  const visibleTotal = Math.min(page * limit, initial.total);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <SearchHero initialSearch={search} initialLocation={location} />

        <section className="mx-auto max-w-[1280px] px-6 py-16 md:px-12">
          <div className="flex flex-col gap-12 md:flex-row">
            <FiltersSidebar />

            <div className="flex-1">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-ink">Featured Opportunities</h2>
                  <p className="text-base text-[color:var(--color-ink-muted)]">
                    Showing {visibleTotal.toLocaleString()} of {initial.total.toLocaleString()} roles found
                  </p>
                </div>

                <SortBy current={sort} />
              </div>

              {initial.items.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {initial.items.map((job) => (
                      <JobCard key={job._id} job={job} />
                    ))}
                  </div>

                  {page * limit < initial.total && (
                    <div className="mt-8 flex justify-center">
                      <LoadMore nextPage={page + 1} />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <JobsFooter />
    </div>
  );
}

function SortBy({ current }: { current: 'recent' | 'oldest' }) {
  const label = current === 'oldest' ? 'Oldest First' : 'Newest First';
  return (
    <div className="flex items-center gap-2 text-base">
      <span className="font-medium text-[color:var(--color-ink-muted)]">Sort by:</span>
      <span className="inline-flex items-center gap-1 font-bold text-ink">
        {label}
        <svg viewBox="0 0 10 6" className="h-[6px] w-[10px]" fill="none" aria-hidden="true">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[12px] border border-dashed border-[color:var(--color-border-solid)] bg-white p-12 text-center">
      <p className="text-lg font-semibold text-ink">No matching roles yet</p>
      <p className="mt-2 text-base text-[color:var(--color-ink-muted)]">
        Try adjusting your filters or broadening your search keywords.
      </p>
    </div>
  );
}
