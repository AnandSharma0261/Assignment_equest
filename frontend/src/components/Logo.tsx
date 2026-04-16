import Link from 'next/link';

type Props = {
  href?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'gradient' | 'solid';
  className?: string;
};

const sizes = {
  sm: {
    box: 'h-8 w-8 rounded-[6px]',
    icon: 'h-4 w-4',
    text: 'text-[18px]',
    tracking: '-0.5px',
    weight: 'font-bold',
  },
  md: {
    box: 'h-10 w-10 rounded-lg',
    icon: 'h-5 w-5',
    text: 'text-2xl',
    tracking: '-0.6px',
    weight: 'font-bold',
  },
  lg: {
    box: 'h-10 w-10',
    icon: 'h-[30px] w-[30px]',
    text: 'text-[30px] leading-9',
    tracking: '-0.75px',
    weight: 'font-extrabold',
  },
};

export default function Logo({
  href = '/',
  size = 'md',
  variant = 'gradient',
  className = '',
}: Props) {
  const s = sizes[size];
  const iconWrap =
    variant === 'gradient'
      ? `brand-gradient inline-flex items-center justify-center ${s.box}`
      : 'inline-flex items-center justify-center';
  const iconColor =
    variant === 'gradient' ? 'text-white' : 'text-[color:var(--color-brand-700)]';

  const content = (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <span className={iconWrap}>
        <BriefcaseIcon className={`${s.icon} ${iconColor}`} />
      </span>
      <span
        className={`${s.weight} text-ink ${s.text}`}
        style={{ letterSpacing: s.tracking }}
      >
        JobBoard
      </span>
    </div>
  );
  if (!href) return content;
  return (
    <Link href={href} className="inline-flex items-center" aria-label="JobBoard home">
      {content}
    </Link>
  );
}

function BriefcaseIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 19"
      aria-hidden="true"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 4V3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1h4a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1h4Zm2 0h2V3H9v1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M2 9h16" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
