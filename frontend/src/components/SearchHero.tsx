'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchHero({
  initialSearch = '',
  initialLocation = '',
}: {
  initialSearch?: string;
  initialLocation?: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (location.trim()) params.set('location', location.trim());
    const qs = params.toString();
    router.push(qs ? `/jobs?${qs}` : '/jobs');
  }

  return (
    <section className="bg-[color:var(--color-hero)]">
      <div className="mx-auto grid max-w-[1184px] grid-cols-1 gap-10 px-6 py-20 md:grid-cols-2 md:px-12">
        <div className="flex flex-col justify-center gap-6">
          <h1
            className="text-[44px] font-bold leading-[55px] text-ink"
            style={{ letterSpacing: '-1.1px' }}
          >
            Find your next{' '}
            <span className="text-[color:var(--color-brand-700)]">masterpiece</span>{' '}
            career.
          </h1>
          <p className="text-lg leading-[29px] text-[color:var(--color-ink-muted)]">
            A curated gallery of premium roles from industry-leading companies. We
            prioritize design quality and professional impact over database volume.
          </p>

          <form
            onSubmit={handleSubmit}
            className="cta-shadow flex flex-col gap-2 rounded-[12px] bg-white p-2 sm:flex-row"
          >
            <div className="flex flex-1 items-center gap-3 rounded-[8px] bg-[color:var(--color-toggle)] px-4">
              <SearchIcon />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Job title or keyword"
                className="h-[66px] flex-1 bg-transparent text-base outline-none placeholder:text-[color:var(--color-ink-placeholder)]"
                autoComplete="off"
              />
            </div>

            <div className="flex flex-1 items-center gap-3 rounded-[8px] bg-[color:var(--color-toggle)] px-4">
              <LocationIcon />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="h-[66px] flex-1 bg-transparent text-base outline-none placeholder:text-[color:var(--color-ink-placeholder)]"
                autoComplete="off"
              />
            </div>

            <button
              type="submit"
              className="cta-gradient rounded-[8px] px-8 py-3 text-base font-bold text-white transition-transform hover:brightness-105 active:scale-[0.99]"
            >
              Search
            </button>
          </form>
        </div>

        <HeroImage />
      </div>
    </section>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 18 18" className="h-[18px] w-[18px] text-[color:var(--color-icon-muted)]" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.75" />
      <path d="m12.5 12.5 3.5 3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 16 20" className="h-5 w-4 text-[color:var(--color-icon-muted)]" fill="none" aria-hidden="true">
      <path
        d="M8 1.5c3.6 0 6.5 2.9 6.5 6.5 0 4.8-6.5 10.5-6.5 10.5S1.5 12.8 1.5 8c0-3.6 2.9-6.5 6.5-6.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="8" cy="8" r="2.25" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function HeroImage() {
  return (
    <div className="relative hidden overflow-hidden rounded-[16px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] md:block">
      <div
        className="aspect-[616/400] w-full"
        style={{
          background:
            'linear-gradient(135deg, #cfd8e8 0%, #e8f0f8 45%, #9fbce0 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 30% 80%, rgba(34, 100, 45, 0.5) 0%, rgba(34, 100, 45, 0) 55%), radial-gradient(circle at 70% 90%, rgba(30, 80, 40, 0.45) 0%, rgba(30, 80, 40, 0) 60%)',
        }}
      />
      <div className="absolute inset-0" style={{ background: 'rgba(0, 74, 198, 0.08)' }} />
    </div>
  );
}
