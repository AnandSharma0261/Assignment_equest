import Link from 'next/link';

type Column = { title: string; links: { label: string; href: string }[] };

const COLUMNS: Column[] = [
  {
    title: 'Platform',
    links: [
      { label: 'Browse Jobs', href: '/jobs' },
      { label: 'Companies', href: '#' },
      { label: 'Career Advice', href: '#' },
    ],
  },
  {
    title: 'Employers',
    links: [
      { label: 'Post a Job', href: '/employer/post' },
      { label: 'Pricing', href: '#' },
      { label: 'For Employers', href: '/register/employer' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Contact Support', href: '#' },
    ],
  },
];

export default function DetailFooter() {
  return (
    <footer className="bg-[color:var(--color-bg-subtle)]">
      <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <p className="text-lg font-bold text-[#0F172A]">JobBoard</p>
            <p className="max-w-[272px] text-base leading-[26px] text-[color:var(--color-ink-faint)]">
              The curated career gallery for design-forward professionals.
            </p>
            <p className="text-base text-[color:var(--color-ink-faint)]">
              © {new Date().getFullYear()} JobBoard Editorial. All rights reserved.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="space-y-4">
              <h5 className="text-base font-bold text-ink">{col.title}</h5>
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
      </div>
    </footer>
  );
}
