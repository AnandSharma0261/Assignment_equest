'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function LoadMore({ nextPage }: { nextPage: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleClick() {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));
    router.push(`/jobs?${params.toString()}`, { scroll: false });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-[8px] bg-[color:var(--color-button-soft)] px-10 py-3 text-base font-bold text-ink transition-colors hover:brightness-95"
    >
      Load more opportunities
    </button>
  );
}
