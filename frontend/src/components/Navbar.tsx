'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  { label: 'Profile', href: '#' },
];

const ANON_LINKS: NavItem[] = [
  { label: 'Browse', href: '/jobs' },
];

export default function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

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
    <header className="bg-white">
      <nav className="mx-auto flex h-[78px] max-w-[1280px] items-center justify-between px-6 md:px-12">
        <Logo size="md" />

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
                className="text-base font-medium text-[color:var(--color-ink-muted)] hover:text-ink"
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
                className="cta-gradient rounded-[8px] px-6 py-3 text-base font-bold text-white transition-transform hover:brightness-105"
              >
                Post a Job
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
