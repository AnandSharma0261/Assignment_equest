'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function PostJobFooter() {
  return (
    <footer className="bg-[color:var(--color-bg-subtle)]">
      <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <Logo size="sm" variant="solid" />
            <p className="text-base text-[color:var(--color-ink-faint)]">
              © {new Date().getFullYear()} JobBoard Editorial. All rights reserved.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-[#0F172A]">Product</h3>
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Terms of Service</FooterLink>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-[#0F172A]">Company</h3>
            <FooterLink href="#">Contact Support</FooterLink>
            <FooterLink href="/register/employer">For Employers</FooterLink>
          </div>

          <SubscribeColumn />
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block text-base text-[color:var(--color-ink-faint)] transition-colors hover:text-[#0F172A]"
    >
      {children}
    </Link>
  );
}

function SubscribeColumn() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-[#0F172A]">Subscribe</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (email.trim()) setSent(true);
        }}
        className="flex items-center gap-2"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="h-[38px] flex-1 rounded-[8px] border border-[color:var(--color-divider)] bg-white px-4 text-sm outline-none placeholder:text-[color:var(--color-ink-placeholder)] focus:border-[color:var(--color-brand-600)]"
        />
        <button
          type="submit"
          className="h-[38px] rounded-[8px] bg-[color:var(--color-brand-600)] px-4 text-sm font-semibold text-white transition-transform hover:brightness-105"
        >
          Join
        </button>
      </form>
      {sent && (
        <p className="text-xs text-[color:var(--color-success)]">
          Thanks — we&apos;ll be in touch.
        </p>
      )}
    </div>
  );
}
