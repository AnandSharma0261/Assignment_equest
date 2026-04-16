import Link from 'next/link';
import Logo from '@/components/Logo';

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Platform',
    links: [
      { label: 'Browse Jobs', href: '/jobs' },
      { label: 'Companies', href: '#' },
      { label: 'Salaries', href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact Support', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
    ],
  },
  {
    title: 'Employers',
    links: [
      { label: 'Post a Job', href: '/employer/post' },
      { label: 'For Employers', href: '/register/employer' },
      { label: 'Hiring Solutions', href: '#' },
    ],
  },
];

export default function ApplicationsFooter() {
  return (
    <footer className="bg-[color:var(--color-bg-subtle)]">
      <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <Logo size="sm" variant="solid" />
            <p className="text-base leading-[26px] text-[color:var(--color-ink-faint)]">
              The elite career platform for creative and technical professionals.
              Curating the future of work.
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.title} className="space-y-3">
              <h4 className="text-base font-semibold text-[#0F172A]">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-base text-[color:var(--color-ink-faint)] transition-colors hover:text-[#0F172A]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-[color:var(--color-divider)] pt-6 md:flex-row md:items-center">
          <p className="text-sm text-[color:var(--color-ink-faint)]">
            © {new Date().getFullYear()} JobBoard Editorial. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[#94A3B8]">
            <Dot />
            <Dot />
          </div>
        </div>
      </div>
    </footer>
  );
}

function Dot() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5 fill-current" aria-hidden="true">
      <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="3" />
    </svg>
  );
}
