import Link from 'next/link';
import Logo from '@/components/Logo';

type Column = { title: string; links: { label: string; href: string }[] };

const COLUMNS: Column[] = [
  {
    title: 'Candidates',
    links: [
      { label: 'Browse Jobs', href: '/jobs' },
      { label: 'Success Stories', href: '#' },
      { label: 'Career Advice', href: '#' },
      { label: 'Resume Review', href: '#' },
    ],
  },
  {
    title: 'Employers',
    links: [
      { label: 'For Employers', href: '/register/employer' },
      { label: 'Post a Job', href: '/employer/post' },
      { label: 'Hiring Solutions', href: '#' },
      { label: 'Pricing', href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Contact Support', href: '#' },
      { label: 'Help Center', href: '#' },
    ],
  },
];

export default function JobsFooter() {
  return (
    <footer className="bg-[color:var(--color-bg-subtle)]">
      <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <Logo size="sm" />
            <p className="max-w-[272px] text-base leading-[26px] text-[color:var(--color-ink-faint)]">
              The premium editorial career gallery for elite professionals and
              industry-leading design teams.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="space-y-4">
              <h4 className="text-base font-semibold text-[#0F172A]">{col.title}</h4>
              <ul className="space-y-3">
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

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[color:var(--color-divider)] pt-8 md:flex-row md:items-center">
          <p className="text-base text-[color:var(--color-ink-faint)]">
            © {new Date().getFullYear()} JobBoard Editorial. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[#94A3B8]">
            <SocialIcon label="Careers feed" path="M4 3a1 1 0 0 1 1-1h4l2 2h8a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3Z" />
            <SocialIcon label="Community" path="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 9a8 8 0 0 1 16 0H4Z" />
            <SocialIcon label="Globe" path="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm6.93-11a15.7 15.7 0 0 0-.97-5 8 8 0 0 1 4 5Zm-2 0c-.46-5.1-1.66-7-2.13-7S10.46 3.9 10 9Z" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ label, path }: { label: string; path: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex h-5 w-5 items-center justify-center transition-opacity hover:opacity-80"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d={path} />
      </svg>
    </button>
  );
}
