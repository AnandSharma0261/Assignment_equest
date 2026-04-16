'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Application, Job } from '@/lib/types';
import StatusBadge, { InterviewCell } from './StatusBadge';
import { companyInitials } from '@/lib/format';

type AppWithJob = Omit<Application, 'job'> & { job: Job };

const PAGE_SIZE = 4;

export default function ApplicationsTable({
  items,
  archivedCount = 0,
}: {
  items: Application[];
  archivedCount?: number;
}) {
  const resolved = items.filter(
    (a): a is AppWithJob => typeof a.job === 'object' && a.job !== null,
  );

  const [tab, setTab] = useState<'active' | 'archived'>('active');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const activeList = resolved.filter((a) => a.status !== 'rejected');
    const archivedList = resolved.filter((a) => a.status === 'rejected');
    const list = tab === 'archived' ? archivedList : activeList;
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (a) =>
        a.job.title.toLowerCase().includes(q) ||
        a.job.company.toLowerCase().includes(q),
    );
  }, [resolved, tab, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const activeTotal = resolved.filter((a) => a.status !== 'rejected').length;

  return (
    <div
      className="overflow-hidden rounded-[12px] bg-white"
      style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}
    >
      <div className="flex flex-col items-start justify-between gap-4 bg-[color:var(--color-toggle)] p-6 md:flex-row md:items-center">
        <div className="flex flex-wrap items-center gap-4">
          <SearchInput value={search} onChange={setSearch} />
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-[8px] bg-[color:var(--color-button-soft)] px-4 py-2 text-base font-medium text-ink"
          >
            <FilterIcon />
            Filters
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Tab
            active={tab === 'active'}
            onClick={() => {
              setTab('active');
              setPage(1);
            }}
          >
            Active ({activeTotal})
          </Tab>
          <Tab
            active={tab === 'archived'}
            onClick={() => {
              setTab('archived');
              setPage(1);
            }}
          >
            Archived ({archivedCount || resolved.filter((a) => a.status === 'rejected').length})
          </Tab>
        </div>
      </div>

      {paged.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="hidden md:block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[color:var(--color-toggle)] text-left">
                  <HeaderCell className="pl-8">Company &amp; Role</HeaderCell>
                  <HeaderCell>Date Applied</HeaderCell>
                  <HeaderCell>Status</HeaderCell>
                  <HeaderCell>Interview</HeaderCell>
                  <HeaderCell className="text-right pr-8">Actions</HeaderCell>
                </tr>
              </thead>
              <tbody>
                {paged.map((a) => (
                  <Row key={a._id} app={a} />
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 p-4 md:hidden">
            {paged.map((a) => (
              <MobileCard key={a._id} app={a} />
            ))}
          </div>
        </>
      )}

      <div className="flex items-center justify-between border-t border-[color:var(--color-border-faint)] px-6 py-5">
        <p className="text-base text-[color:var(--color-ink-muted)]">
          Showing {paged.length} of {filtered.length} {tab} applications
        </p>
        <div className="flex items-center gap-4">
          <PagerButton
            label="Previous"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ‹
          </PagerButton>
          <PagerButton
            label="Next"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            ›
          </PagerButton>
        </div>
      </div>
    </div>
  );
}

function HeaderCell({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`py-4 px-8 text-left text-xs font-semibold uppercase tracking-[0.6px] text-[color:var(--color-ink-muted)] ${className}`}
    >
      {children}
    </th>
  );
}

function Row({ app }: { app: AppWithJob }) {
  return (
    <tr className="border-t border-[color:var(--color-hero)]">
      <td className="pl-8 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] bg-[#F1F5F9] text-sm font-bold text-[color:var(--color-ink-muted)]">
            {companyInitials(app.job.company)}
          </div>
          <div>
            <Link
              href={`/jobs/${app.job._id}`}
              className="block text-lg font-semibold text-ink hover:text-[color:var(--color-brand-700)]"
            >
              {app.job.title}
            </Link>
            <p className="text-xs text-[color:var(--color-ink-muted)]">
              {app.job.company} • {app.job.location}
            </p>
          </div>
        </div>
      </td>
      <td className="px-8 py-6 text-base text-[color:var(--color-ink-muted)]">
        {formatDate(app.createdAt)}
      </td>
      <td className="px-8 py-6">
        <StatusBadge status={app.status} />
      </td>
      <td className="px-8 py-6">
        <InterviewCell status={app.status} />
      </td>
      <td className="pr-8 py-6 text-right">
        {app.status === 'hired' ? (
          <Link
            href={`/jobs/${app.job._id}`}
            className="cta-gradient inline-flex items-center justify-center rounded-[8px] px-4 py-1.5 text-xs font-semibold text-white"
          >
            View Offer
          </Link>
        ) : (
          <button
            type="button"
            aria-label="More actions"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[color:var(--color-ink-muted)] transition-colors hover:bg-[color:var(--color-button-soft)]"
          >
            ⋮
          </button>
        )}
      </td>
    </tr>
  );
}

function MobileCard({ app }: { app: AppWithJob }) {
  return (
    <div className="flex flex-col gap-3 rounded-[8px] border border-[color:var(--color-border-faint)] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#F1F5F9] text-xs font-bold text-[color:var(--color-ink-muted)]">
          {companyInitials(app.job.company)}
        </div>
        <div className="min-w-0 flex-1">
          <Link href={`/jobs/${app.job._id}`} className="block font-semibold text-ink">
            {app.job.title}
          </Link>
          <p className="truncate text-xs text-[color:var(--color-ink-muted)]">
            {app.job.company} • {app.job.location}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <StatusBadge status={app.status} />
        <span className="text-xs text-[color:var(--color-ink-muted)]">
          {formatDate(app.createdAt)}
        </span>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
      <p className="text-lg font-semibold text-ink">No applications match</p>
      <p className="text-base text-[color:var(--color-ink-muted)]">
        Try a different search or browse roles on the home feed.
      </p>
    </div>
  );
}

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-ink-muted)]">
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="m11 11 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search applications…"
        className="h-10 w-64 rounded-[8px] border border-[color:var(--color-border)] bg-white pl-10 pr-4 text-base outline-none placeholder:text-[color:var(--color-ink-placeholder)] focus:border-[color:var(--color-brand-600)]"
      />
    </div>
  );
}

function Tab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
        active
          ? 'bg-[color:var(--color-tag-blue-bg)] text-[color:var(--color-tag-blue-fg)]'
          : 'text-[color:var(--color-ink-muted)] hover:bg-[color:var(--color-button-soft)]'
      }`}
    >
      {children}
    </button>
  );
}

function PagerButton({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] bg-[color:var(--color-button-soft)] text-sm text-[color:var(--color-ink-muted)] transition-all disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 14 10" className="h-[10px] w-[14px]" fill="none" aria-hidden="true">
      <path d="M1 1h12M3 5h8M5 9h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
