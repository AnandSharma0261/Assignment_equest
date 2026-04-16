import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="bg-[color:var(--color-bg-subtle)]">
      <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="brand-gradient inline-flex h-7 w-7 items-center justify-center rounded-[6px]">
                <svg viewBox="0 0 20 19" className="h-3.5 w-3.5 text-white" fill="none">
                  <path
                    d="M7 4V3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1h4a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1h4Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </span>
              <span className="text-lg font-bold text-[#0F172A]">JobBoard</span>
            </div>
            <p className="max-w-[272px] text-base leading-[26px] text-[color:var(--color-ink-faint)]">
              The editorial career experience for modern professionals seeking curated
              opportunities.
            </p>
          </div>

          <FooterColumn title="Platform">
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Terms of Service</FooterLink>
          </FooterColumn>

          <FooterColumn title="Support">
            <FooterLink href="#">Contact Support</FooterLink>
            <FooterLink href="#">Help Center</FooterLink>
          </FooterColumn>

          <FooterColumn title="For Business">
            <FooterLink href="#">For Employers</FooterLink>
            <FooterLink href="#">Talent Solutions</FooterLink>
          </FooterColumn>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[color:var(--color-divider)] pt-8 md:flex-row md:items-center">
          <p className="text-base text-[color:var(--color-ink-faint)]">
            © {new Date().getFullYear()} JobBoard Editorial. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[#94A3B8]">
            <SocialIcon label="Website" path="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm6.93 9h-3.03a15.7 15.7 0 0 0-.97-5 8 8 0 0 1 4 5ZM12 4c.47 0 1.67 1.9 2.13 7H9.87C10.33 5.9 11.53 4 12 4Zm-2.93 1a15.7 15.7 0 0 0-.97 5H5.07a8 8 0 0 1 4-5ZM5.07 13H8.1c.13 1.76.47 3.47.97 5a8 8 0 0 1-4-5ZM12 20c-.47 0-1.67-1.9-2.13-7h4.26c-.46 5.1-1.66 7-2.13 7Zm2.93-1a15.7 15.7 0 0 0 .97-5h3.03a8 8 0 0 1-4 5Z" />
            <SocialIcon label="Globe" path="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z" />
            <SocialIcon label="Chat" path="M4 4h16v12H7l-3 3V4Z" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h4 className="text-base font-semibold text-[#0F172A]">{title}</h4>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-base text-[color:var(--color-ink-faint)] transition-colors hover:text-[#0F172A]"
      >
        {children}
      </Link>
    </li>
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
