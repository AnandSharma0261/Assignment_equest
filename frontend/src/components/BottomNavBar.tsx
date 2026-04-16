'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Tab = {
  label: string;
  href: string;
  match: (p: string) => boolean;
  icon: (active: boolean) => React.ReactNode;
};

const TABS: Tab[] = [
  {
    label: 'Browse',
    href: '/jobs',
    match: (p) => p === '/jobs' || p.startsWith('/jobs/'),
    icon: (active) => <SearchIcon active={active} />,
  },
  {
    label: 'Saved',
    href: '#',
    match: (p) => p === '/saved',
    icon: (active) => <BookmarkIcon active={active} />,
  },
  {
    label: 'Applications',
    href: '/applications',
    match: (p) => p.startsWith('/applications'),
    icon: (active) => <ApplicationsIcon active={active} />,
  },
  {
    label: 'Profile',
    href: '#',
    match: (p) => p === '/profile',
    icon: (active) => <ProfileIcon active={active} />,
  },
];

export default function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-[#F1F5F9] bg-white shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1),0_-4px_6px_-4px_rgba(0,0,0,0.1)] md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {TABS.map((tab) => {
        const active = tab.match(pathname);
        const color = active ? 'text-[color:var(--color-brand-600)]' : 'text-[#94A3B8]';
        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={`flex flex-col items-center gap-[3.5px] text-[11px] font-medium leading-4 ${color}`}
            aria-current={active ? 'page' : undefined}
          >
            {tab.icon(active)}
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SearchIcon({ active }: { active: boolean }) {
  const stroke = active ? 'currentColor' : 'currentColor';
  const width = active ? 2 : 1.75;
  return (
    <svg viewBox="0 0 18 18" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke={stroke} strokeWidth={width} />
      <path d="m12.5 12.5 3.5 3.5" stroke={stroke} strokeWidth={width} strokeLinecap="round" />
    </svg>
  );
}

function BookmarkIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 14 18" className="h-[18px] w-[14px]" fill={active ? 'currentColor' : 'none'} aria-hidden="true">
      <path
        d="M1 2.5A1.5 1.5 0 0 1 2.5 1h9A1.5 1.5 0 0 1 13 2.5V17l-6-3.5L1 17V2.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ApplicationsIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 18 20" className="h-[20px] w-[18px]" fill="none" aria-hidden="true">
      <rect
        x="1"
        y="3"
        width="16"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
        fill={active ? 'currentColor' : 'none'}
        fillOpacity={active ? 0.12 : 0}
      />
      <path d="M6 1h6v3H6z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <circle cx="9" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 16c.7-1.5 2-2.3 3.5-2.3s2.8.8 3.5 2.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className="h-[16px] w-[16px]" fill="none" aria-hidden="true">
      <circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.75" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? 0.15 : 0} />
      <path d="M2 15c1-3 3.5-4.5 6-4.5S13 12 14 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
