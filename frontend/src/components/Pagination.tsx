'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function pageRange(current: number, total: number): (number | 'dots')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, 'dots', total];
  if (current >= total - 3) return [1, 'dots', total - 4, total - 3, total - 2, total - 1, total];
  return [1, 'dots', current - 1, current, current + 1, 'dots', total];
}

export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function hrefFor(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(p));
    return `/jobs?${params.toString()}`;
  }

  const items = pageRange(currentPage, totalPages);
  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex items-center justify-center gap-2"
    >
      {prevDisabled ? (
        <span
          aria-disabled="true"
          className="flex h-10 min-w-10 items-center justify-center rounded-[8px] border border-[color:var(--color-border-solid)] bg-white px-3 text-sm font-medium text-[color:var(--color-ink-placeholder)] opacity-50"
        >
          Previous
        </span>
      ) : (
        <Link
          href={hrefFor(currentPage - 1)}
          scroll={false}
          className="flex h-10 min-w-10 items-center justify-center rounded-[8px] border border-[color:var(--color-border-solid)] bg-white px-3 text-sm font-medium text-ink transition-colors hover:bg-[color:var(--color-button-soft)]"
        >
          Previous
        </Link>
      )}

      {items.map((item, i) =>
        item === 'dots' ? (
          <span
            key={`dots-${i}`}
            className="flex h-10 min-w-10 items-center justify-center text-sm text-[color:var(--color-ink-muted)]"
          >
            …
          </span>
        ) : item === currentPage ? (
          <span
            key={item}
            aria-current="page"
            className="cta-gradient flex h-10 min-w-10 items-center justify-center rounded-[8px] px-3 text-sm font-bold text-white"
          >
            {item}
          </span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            scroll={false}
            className="flex h-10 min-w-10 items-center justify-center rounded-[8px] border border-[color:var(--color-border-solid)] bg-white px-3 text-sm font-medium text-ink transition-colors hover:bg-[color:var(--color-button-soft)]"
          >
            {item}
          </Link>
        ),
      )}

      {nextDisabled ? (
        <span
          aria-disabled="true"
          className="flex h-10 min-w-10 items-center justify-center rounded-[8px] border border-[color:var(--color-border-solid)] bg-white px-3 text-sm font-medium text-[color:var(--color-ink-placeholder)] opacity-50"
        >
          Next
        </span>
      ) : (
        <Link
          href={hrefFor(currentPage + 1)}
          scroll={false}
          className="flex h-10 min-w-10 items-center justify-center rounded-[8px] border border-[color:var(--color-border-solid)] bg-white px-3 text-sm font-medium text-ink transition-colors hover:bg-[color:var(--color-button-soft)]"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
