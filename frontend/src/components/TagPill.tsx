import type { ReactNode } from 'react';

type Tone = 'blue' | 'green' | 'purple' | 'yellow' | 'gray' | 'red' | 'amber';

const tones: Record<Tone, string> = {
  blue: 'bg-[color:var(--color-tag-blue-bg)] text-[color:var(--color-tag-blue-fg)]',
  green: 'bg-[color:var(--color-tag-green-bg)] text-[color:var(--color-tag-green-fg)]',
  purple: 'bg-[color:var(--color-tag-purple-bg)] text-[color:var(--color-tag-purple-fg)]',
  yellow: 'bg-[color:var(--color-tag-yellow-bg)] text-[color:var(--color-tag-yellow-fg)]',
  gray: 'bg-[color:var(--color-tag-gray-bg)] text-[color:var(--color-tag-gray-fg)]',
  red: 'bg-[color:var(--color-tag-red-bg)] text-[color:var(--color-tag-red-fg)]',
  amber: 'bg-[color:var(--color-tag-amber-bg)] text-[color:var(--color-tag-amber-fg)]',
};

export default function TagPill({
  children,
  tone = 'gray',
  uppercase = true,
}: {
  children: ReactNode;
  tone?: Tone;
  uppercase?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-[3px] text-[11px] font-bold ${
        uppercase ? 'uppercase tracking-wider' : ''
      } ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function toneForJobType(
  t: string,
): 'blue' | 'green' | 'purple' | 'yellow' | 'gray' {
  switch (t) {
    case 'remote':
      return 'blue';
    case 'full-time':
      return 'green';
    case 'contract':
      return 'purple';
    case 'internship':
      return 'yellow';
    case 'part-time':
      return 'gray';
    default:
      return 'gray';
  }
}
