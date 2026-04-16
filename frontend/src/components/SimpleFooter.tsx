import Link from 'next/link';

export default function SimpleFooter() {
  return (
    <footer className="border-t border-[color:var(--color-border-faint)]">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-[color:var(--color-ink-muted)] md:flex-row md:px-12">
        <p>© {new Date().getFullYear()} JobBoard Editorial. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="#" className="hover:text-ink">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-ink">
            Terms of Service
          </Link>
          <Link href="#" className="hover:text-ink">
            Contact Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
