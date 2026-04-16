'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

const DEBOUNCE_MS = 450;

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
  const [, startTransition] = useTransition();

  const firstRender = useRef(true);
  const lastPushed = useRef<string>('');

  function pushUrl(s: string, l: string) {
    const params = new URLSearchParams();
    if (s.trim()) params.set('search', s.trim());
    if (l.trim()) params.set('location', l.trim());
    const qs = params.toString();
    const url = qs ? `/jobs?${qs}` : '/jobs';
    if (url === lastPushed.current) return;
    lastPushed.current = url;
    startTransition(() => router.push(url, { scroll: false }));
  }

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      lastPushed.current = window.location.pathname + window.location.search;
      return;
    }
    const t = setTimeout(() => pushUrl(search, location), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [search, location]);

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    pushUrl(search, location);
  }

  return (
    <section className="bg-[color:var(--color-hero)]">
      <div className="mx-auto grid max-w-[1184px] grid-cols-1 gap-10 px-6 py-20 md:px-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex min-w-0 flex-col items-center justify-center gap-6 text-center lg:items-start lg:text-left">
          <h1
            className="text-[40px] font-extrabold leading-[48px] text-ink lg:text-[44px] lg:leading-[55px]"
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
            className="card-shadow flex w-full max-w-[672px] flex-col gap-2 rounded-[12px] bg-white p-3 lg:flex-row lg:p-2"
          >
            <div className="flex h-[56px] min-w-0 flex-[1.8] items-center gap-2 rounded-[8px] bg-[color:var(--color-toggle)] px-3 lg:h-[56px]">
              <SearchIcon />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Job title or keyword"
                className="h-full w-full min-w-0 flex-1 bg-transparent text-sm leading-[19px] text-ink outline-none placeholder:text-[#C3C6D7]"
                autoComplete="off"
              />
            </div>

            <div className="flex h-[56px] min-w-0 flex-1 items-center gap-2 rounded-[8px] bg-[color:var(--color-toggle)] px-3 lg:h-[56px]">
              <LocationIcon />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="h-full w-full min-w-0 flex-1 bg-transparent text-sm leading-[19px] text-ink outline-none placeholder:text-[#C3C6D7]"
                autoComplete="off"
              />
            </div>

            <button
              type="submit"
              className="cta-gradient h-14 shrink-0 rounded-[8px] px-5 text-sm font-bold text-white transition-transform hover:brightness-105 active:scale-[0.99] lg:h-[44px] lg:self-center"
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
    <div className="relative hidden aspect-[616/400] min-w-0 overflow-hidden rounded-[16px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] lg:block">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1545165375-1b744b9ed444?w=1200&h=780&fit=crop&auto=format&q=80"
        alt="Plants lined up by a window inside a bright workspace"
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'rgba(0, 74, 198, 0.08)' }}
        aria-hidden="true"
      />
    </div>
  );
}
