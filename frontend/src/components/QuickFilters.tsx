'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const POPULAR = ['Design', 'Engineering', 'Product', 'Marketing', 'Sales'];

export default function QuickFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function pick(label: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('search', label);
    params.delete('page');
    router.push(`/jobs?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-6 py-6 md:px-12 lg:hidden">
      <div className="flex w-full min-w-0 flex-wrap items-center gap-x-2 gap-y-2">
        <span className="text-sm font-semibold text-[color:var(--color-ink-muted)]">
          Popular:
        </span>
        {POPULAR.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => pick(label)}
            className="rounded-full bg-[color:var(--color-button-soft)] px-4 py-2 text-sm font-medium text-ink transition-colors hover:brightness-95"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
