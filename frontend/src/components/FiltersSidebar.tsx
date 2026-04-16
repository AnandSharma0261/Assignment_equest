'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const EMPLOYMENT_TYPES: { label: string; value: string }[] = [
  { label: 'Full-time', value: 'full-time' },
  { label: 'Part-time', value: 'part-time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Remote', value: 'remote' },
  { label: 'Internship', value: 'internship' },
];

const EXPERIENCE_LEVELS = ['Entry Level', 'Senior Level', 'Executive'];

export default function FiltersSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('jobType') || '';

  const [selected, setSelected] = useState<string[]>(
    current ? current.split(',').filter(Boolean) : [],
  );
  const [experience, setExperience] = useState<string>('Senior Level');

  useEffect(() => {
    setSelected(current ? current.split(',').filter(Boolean) : []);
  }, [current]);

  function applyJobTypes(next: string[]) {
    setSelected(next);
    const params = new URLSearchParams(searchParams.toString());
    if (next.length) params.set('jobType', next.join(','));
    else params.delete('jobType');
    params.delete('page');
    router.push(`/jobs?${params.toString()}`);
  }

  function toggle(value: string) {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    applyJobTypes(next);
  }

  return (
    <aside className="flex w-full flex-col gap-8 md:w-[288px]">
      <div className="rounded-[12px] bg-[color:var(--color-toggle)] p-6">
        <h3 className="mb-6 text-base font-bold text-ink">Filter Results</h3>

        <FilterGroup title="Employment Type">
          <div className="flex flex-col gap-3">
            {EMPLOYMENT_TYPES.map((t) => (
              <Checkbox
                key={t.value}
                label={t.label}
                checked={selected.includes(t.value)}
                onChange={() => toggle(t.value)}
              />
            ))}
          </div>
        </FilterGroup>

        <div className="h-6" />

        <FilterGroup title="Experience Level">
          <div className="flex flex-col gap-3">
            {EXPERIENCE_LEVELS.map((level) => (
              <Radio
                key={level}
                name="experience"
                label={level}
                checked={experience === level}
                onChange={() => setExperience(level)}
              />
            ))}
          </div>
        </FilterGroup>
      </div>

      <JobAlertsCard />
    </aside>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-3 text-base font-semibold uppercase tracking-[0.8px] text-[color:var(--color-icon-muted)]">
        {title}
      </h4>
      {children}
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-base text-[color:var(--color-ink-muted)]">
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-[4px] border transition-colors ${
          checked
            ? 'border-[color:var(--color-brand-700)] bg-[color:var(--color-brand-700)]'
            : 'border-[color:var(--color-border-solid)] bg-white'
        }`}
      >
        {checked && (
          <svg viewBox="0 0 20 20" className="h-3 w-3 text-white" fill="none" aria-hidden="true">
            <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {label}
    </label>
  );
}

function Radio({
  name,
  label,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-base text-[color:var(--color-ink-muted)]">
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
          checked
            ? 'border-[color:var(--color-brand-700)] bg-[color:var(--color-brand-700)]'
            : 'border-[color:var(--color-border-solid)] bg-white'
        }`}
      >
        {checked && <span className="h-[7px] w-[7px] rounded-full bg-white" />}
      </span>
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      {label}
    </label>
  );
}

function JobAlertsCard() {
  return (
    <div
      className="rounded-[12px] border p-6"
      style={{
        background: 'rgba(37, 99, 235, 0.08)',
        borderColor: 'rgba(0, 74, 198, 0.1)',
      }}
    >
      <SparkleIcon />
      <h4 className="mt-2 text-base font-bold text-ink">Job Alerts</h4>
      <p className="mt-2 mb-4 text-base leading-6 text-[color:var(--color-ink-muted)]">
        Get the latest senior roles delivered to your inbox daily.
      </p>
      <button
        type="button"
        className="w-full rounded-[8px] border bg-white py-2 text-base font-bold text-[color:var(--color-brand-700)] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
        style={{ borderColor: 'rgba(0, 74, 198, 0.05)' }}
      >
        Enable Alerts
      </button>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 22 22" className="h-[22px] w-[22px] text-[color:var(--color-brand-700)]" fill="none" aria-hidden="true">
      <path
        d="M11 2v4m0 10v4M2 11h4m10 0h4M4.5 4.5 7 7m8 8 2.5 2.5M4.5 17.5 7 15m8-8 2.5-2.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
