'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from '@/components/Logo';
import { useAuth } from '@/lib/useAuth';
import { api } from '@/lib/api';

type NavItem = { label: string; href: string };

const SEEKER_LINKS: NavItem[] = [
  { label: 'Browse', href: '/jobs' },
  { label: 'Saved', href: '#' },
  { label: 'Applications', href: '/applications' },
  { label: 'Profile', href: '#' },
];

const EMPLOYER_LINKS: NavItem[] = [
  { label: 'Browse', href: '/jobs' },
  { label: 'My Jobs', href: '/employer' },
  { label: 'Applications', href: '/employer' },
  { label: 'Post a Job', href: '/employer/post' },
];

const ANON_LINKS: NavItem[] = [
  { label: 'Browse', href: '/jobs' },
];

export default function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const links =
    user?.role === 'employer'
      ? EMPLOYER_LINKS
      : user?.role === 'seeker'
      ? SEEKER_LINKS
      : ANON_LINKS;

  async function handleLogout() {
    try {
      await api.logout();
    } finally {
      router.push('/login');
      router.refresh();
    }
  }

  const postJobHref =
    user?.role === 'employer' ? '/employer/post' : '/register/employer';

  return (
    <header className="relative bg-white">
      <nav className="mx-auto flex h-[78px] max-w-[1280px] items-center justify-between px-6 md:px-12">
        <Logo size="md" variant="solid" />

        <ul className="hidden items-center gap-10 md:flex">
          {links.map((link) => {
            const active =
              link.href !== '#' && pathname === link.href;
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`text-base transition-colors ${
                    active
                      ? 'font-bold text-[color:var(--color-brand-700)]'
                      : 'font-medium text-[color:var(--color-ink-muted)] hover:text-ink'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href={postJobHref}
                className="cta-gradient hidden rounded-[8px] px-6 py-3 text-base font-bold text-white transition-transform hover:brightness-105 sm:inline-flex"
              >
                Post a Job
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="hidden text-base font-medium text-[color:var(--color-ink-muted)] hover:text-ink md:inline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-base font-medium text-[color:var(--color-ink-muted)] hover:text-ink sm:inline"
              >
                Sign In
              </Link>
              <Link
                href={postJobHref}
                className="cta-gradient hidden rounded-[8px] px-6 py-3 text-base font-bold text-white transition-transform hover:brightness-105 sm:inline-flex"
              >
                Post a Job
              </Link>
            </>
          )}

          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] text-ink hover:bg-[color:var(--color-button-soft)] md:hidden"
          >
            {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="absolute inset-x-0 top-full z-40 border-t border-[color:var(--color-divider)] bg-white shadow-[0_12px_32px_-4px_rgba(25,28,30,0.08)] md:hidden">
          <ul className="flex flex-col gap-1 px-6 py-4">
            {links.map((link) => {
              const active = link.href !== '#' && pathname === link.href;
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`block rounded-[8px] px-3 py-3 text-base transition-colors ${
                      active
                        ? 'bg-[color:var(--color-button-soft)] font-bold text-[color:var(--color-brand-700)]'
                        : 'font-medium text-[color:var(--color-ink-muted)] hover:bg-[color:var(--color-button-soft)] hover:text-ink'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}

            <li className="mt-2 border-t border-[color:var(--color-divider)] pt-3">
              {user ? (
                <>
                  <Link
                    href={postJobHref}
                    className="cta-gradient block rounded-[8px] px-4 py-3 text-center text-base font-bold text-white"
                  >
                    Post a Job
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 block w-full rounded-[8px] px-3 py-3 text-left text-base font-medium text-[color:var(--color-ink-muted)] hover:bg-[color:var(--color-button-soft)]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block rounded-[8px] px-3 py-3 text-base font-medium text-[color:var(--color-ink-muted)] hover:bg-[color:var(--color-button-soft)]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href={postJobHref}
                    className="cta-gradient mt-2 block rounded-[8px] px-4 py-3 text-center text-base font-bold text-white"
                  >
                    Post a Job
                  </Link>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

function HamburgerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}
