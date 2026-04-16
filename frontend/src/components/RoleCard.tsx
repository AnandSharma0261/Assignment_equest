import Link from 'next/link';
import type { ReactNode } from 'react';

type Props = {
  href: string;
  title: string;
  description: string;
  cta: string;
  icon: ReactNode;
  iconFg: string;
  pill?: { label: string };
};

export default function RoleCard({ href, title, description, cta, icon, iconFg, pill }: Props) {
  return (
    <Link
      href={href}
      className="group relative flex w-full flex-col items-start rounded-[24px] bg-white p-8 transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-8px_rgba(15,23,42,0.08)]"
    >
      {pill && (
        <span className="absolute right-6 top-5 inline-flex items-center rounded-full bg-[color:var(--color-pill-success-bg)] px-3 py-[3px] text-[11px] font-bold uppercase tracking-[0.55px] text-[color:var(--color-pill-success-fg)]">
          {pill.label}
        </span>
      )}

      <span
        className="mb-8 inline-flex h-[62px] w-[62px] items-center justify-center rounded-[24px] bg-[color:var(--color-brand-tint)]"
        style={{ color: iconFg }}
        aria-hidden="true"
      >
        {icon}
      </span>

      <h2 className="mb-3 text-2xl font-semibold leading-8 text-ink">{title}</h2>

      <p className="text-base leading-[26px] text-[color:var(--color-ink-muted)] opacity-80">
        {description}
      </p>

      <span className="mt-8 inline-flex items-center gap-2 text-base font-semibold text-[color:var(--color-brand-700)]">
        {cta}
        <ArrowRight />
      </span>
    </Link>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" aria-hidden="true">
      <path
        d="M3 8h10m0 0-4-4m4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
