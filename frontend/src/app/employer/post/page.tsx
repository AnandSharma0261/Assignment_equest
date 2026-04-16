'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import PostJobFooter from '@/components/PostJobFooter';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/useAuth';
import { JOB_TYPES, type JobType } from '@/lib/types';

const JOB_TYPE_LABELS: Record<JobType, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  remote: 'Remote',
  contract: 'Contract',
  internship: 'Internship',
};

export default function PostJobPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [title, setTitle] = useState('');
  const [jobType, setJobType] = useState<JobType>('full-time');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.company && !company) setCompany(user.company);
  }, [user, company]);

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setError(null);

    if (!user) {
      router.push('/login?role=employer&next=/employer/post');
      return;
    }
    if (user.role !== 'employer') {
      setError('Only employer accounts can post roles.');
      return;
    }
    if (!title || !location || !description || !company) {
      setError('Please fill in title, location, description and company.');
      return;
    }
    const min = salaryMin ? Number(salaryMin.replace(/[^0-9]/g, '')) : undefined;
    const max = salaryMax ? Number(salaryMax.replace(/[^0-9]/g, '')) : undefined;
    if (min != null && max != null && min > max) {
      setError('Minimum salary cannot be greater than maximum.');
      return;
    }

    setSubmitting(true);
    try {
      const job = await api.createJob({
        title: title.trim(),
        company: company.trim(),
        location: location.trim(),
        jobType,
        description: description.trim(),
        salaryMin: min,
        salaryMax: max,
        salaryCurrency: 'USD',
      });
      router.push(`/jobs/${job._id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  }

  const gated = !loading && user && user.role !== 'employer';

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="mx-auto flex max-w-[700px] flex-col items-center gap-4 px-6 pt-16 text-center">
          <h1
            className="text-[36px] font-bold leading-tight text-ink sm:text-[44px] sm:leading-[55px]"
            style={{ letterSpacing: '-1.1px' }}
          >
            Post a New Role
          </h1>
          <p className="text-base leading-[26px] text-[color:var(--color-ink-muted)]">
            Reach the top 1% of talent across our editorial network. Curated,
            high-impact, and professional.
          </p>
        </section>

        <section className="mx-auto w-full max-w-[700px] px-6 pt-12 pb-16">
          {gated ? (
            <GatedState />
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-[8px] bg-white p-8 sm:p-10"
              style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}
            >
              <div className="flex flex-col gap-8">
                <FormSection icon={<DocIcon />} title="Role Details">
                  <Field label="Job Title" htmlFor="title">
                    <TextInput
                      id="title"
                      value={title}
                      onChange={setTitle}
                      placeholder="e.g. Senior Product Designer"
                      disabled={submitting}
                      required
                    />
                  </Field>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field label="Work Type" htmlFor="jobType">
                      <Select
                        id="jobType"
                        value={jobType}
                        onChange={(v) => setJobType(v as JobType)}
                        options={JOB_TYPES.map((t) => ({ value: t, label: JOB_TYPE_LABELS[t] }))}
                        disabled={submitting}
                      />
                    </Field>

                    <Field label="Location" htmlFor="location">
                      <TextInput
                        id="location"
                        value={location}
                        onChange={setLocation}
                        placeholder="New York, NY / Remote"
                        leftIcon={<LocationIcon />}
                        disabled={submitting}
                        required
                      />
                    </Field>
                  </div>

                  <Field label="Job Description" htmlFor="description">
                    <TextArea
                      id="description"
                      value={description}
                      onChange={setDescription}
                      placeholder="Describe the role, responsibilities, and qualifications…"
                      rows={6}
                      disabled={submitting}
                      required
                    />
                  </Field>
                </FormSection>

                <DividerSection icon={<BuildingIcon />} title="Company Profile">
                  <LogoUploadRow />

                  <Field label="Company Name" htmlFor="company">
                    <TextInput
                      id="company"
                      value={company}
                      onChange={setCompany}
                      placeholder="e.g. Nexus Design Studios"
                      disabled={submitting}
                      required
                    />
                  </Field>

                  <Field label="Company Website" htmlFor="website">
                    <TextInput
                      id="website"
                      type="url"
                      value={website}
                      onChange={setWebsite}
                      placeholder="https://company.com"
                      disabled={submitting}
                    />
                  </Field>
                </DividerSection>

                <DividerSection icon={<DollarIcon />} title="Compensation">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Field label="Min Salary (USD)" htmlFor="min">
                      <TextInput
                        id="min"
                        value={salaryMin}
                        onChange={setSalaryMin}
                        placeholder="80,000"
                        inputMode="numeric"
                        disabled={submitting}
                      />
                    </Field>
                    <Field label="Max Salary (USD)" htmlFor="max">
                      <TextInput
                        id="max"
                        value={salaryMax}
                        onChange={setSalaryMax}
                        placeholder="120,000"
                        inputMode="numeric"
                        disabled={submitting}
                      />
                    </Field>
                  </div>
                </DividerSection>

                {error && (
                  <div
                    role="alert"
                    className="rounded-md border border-[color:var(--color-danger)]/20 bg-[color:var(--color-danger)]/5 px-4 py-3 text-sm text-[color:var(--color-danger)]"
                  >
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-4 pt-2 sm:flex-row">
                  <button
                    type="submit"
                    disabled={submitting || loading}
                    className="cta-gradient flex-1 rounded-[8px] py-4 text-base font-semibold text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-transform hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? 'Posting…' : 'Post Job Opening'}
                  </button>
                  <button
                    type="button"
                    disabled
                    title="Draft saving isn't part of this prototype"
                    className="cursor-not-allowed rounded-[8px] bg-[color:var(--color-button-soft)] px-8 py-4 text-base font-semibold text-ink opacity-80"
                  >
                    Save as Draft
                  </button>
                </div>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-base text-[color:var(--color-ink-muted)]">
            By posting, you agree to our{' '}
            <Link href="#" className="underline hover:text-ink">Terms of Service</Link>{' '}
            and{' '}
            <Link href="#" className="underline hover:text-ink">Privacy Policy</Link>.
          </p>
        </section>
      </main>

      <PostJobFooter />
    </div>
  );
}

function GatedState() {
  return (
    <div
      className="rounded-[8px] bg-white p-10 text-center"
      style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}
    >
      <h2 className="text-xl font-bold text-ink">Employer account required</h2>
      <p className="mt-2 text-base text-[color:var(--color-ink-muted)]">
        You&apos;re signed in as a candidate. Switch to an employer account to post roles.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/register/employer"
          className="cta-gradient inline-flex items-center justify-center rounded-[8px] px-6 py-3 text-base font-semibold text-white"
        >
          Create employer account
        </Link>
        <Link
          href="/jobs"
          className="inline-flex items-center justify-center rounded-[8px] bg-[color:var(--color-button-soft)] px-6 py-3 text-base font-semibold text-ink"
        >
          Back to browsing
        </Link>
      </div>
    </div>
  );
}

function FormSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6">
      <SectionHeading icon={icon} title={title} />
      {children}
    </section>
  );
}

function DividerSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6 border-t border-[color:var(--color-hero)] pt-8">
      <SectionHeading icon={icon} title={title} />
      {children}
    </section>
  );
}

function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
      <span className="text-[color:var(--color-brand-700)]">{icon}</span>
      {title}
    </h2>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="px-1 text-base font-medium text-[color:var(--color-ink-muted)]">
        {label}
      </label>
      {children}
    </div>
  );
}

function TextInput({
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled,
  required,
  leftIcon,
  inputMode,
}: {
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  leftIcon?: React.ReactNode;
  inputMode?: 'text' | 'numeric' | 'email' | 'url';
}) {
  return (
    <div className="relative">
      {leftIcon && (
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--color-icon-muted)]">
          {leftIcon}
        </span>
      )}
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        inputMode={inputMode}
        className={`h-[57px] w-full rounded-[8px] border border-[color:var(--color-border)] bg-white text-base outline-none transition-all placeholder:text-[color:var(--color-ink-placeholder)] focus:border-[color:var(--color-brand-600)] focus:ring-2 focus:ring-[color:var(--color-brand-600)]/20 disabled:opacity-60 ${
          leftIcon ? 'pl-12 pr-4' : 'px-4'
        }`}
      />
    </div>
  );
}

function Select({
  id,
  value,
  onChange,
  options,
  disabled,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-[57px] w-full appearance-none rounded-[8px] border border-[color:var(--color-border)] bg-white px-4 pr-10 text-base text-ink outline-none transition-all focus:border-[color:var(--color-brand-600)] focus:ring-2 focus:ring-[color:var(--color-brand-600)]/20 disabled:opacity-60"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[color:var(--color-icon-muted)]" />
    </div>
  );
}

function TextArea({
  id,
  value,
  onChange,
  placeholder,
  rows = 5,
  disabled,
  required,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  required?: boolean;
}) {
  return (
    <textarea
      id={id}
      name={id}
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      className="w-full resize-y rounded-[8px] border border-[color:var(--color-border)] bg-white p-4 text-base leading-[26px] outline-none transition-all placeholder:text-[color:var(--color-ink-placeholder)] focus:border-[color:var(--color-brand-600)] focus:ring-2 focus:ring-[color:var(--color-brand-600)]/20 disabled:opacity-60"
    />
  );
}

function LogoUploadRow() {
  return (
    <div className="flex items-center gap-6">
      <div
        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[12px] bg-[color:var(--color-hero)]"
        style={{ border: '2px dashed rgba(195, 198, 215, 0.45)' }}
      >
        <ImageIcon />
      </div>
      <div className="flex flex-col gap-1">
        <button
          type="button"
          disabled
          title="File uploads aren't part of this prototype"
          className="inline-flex cursor-not-allowed items-center self-start text-sm font-semibold text-[color:var(--color-brand-700)] opacity-80"
        >
          Upload Logo
        </button>
        <p className="text-base text-[color:var(--color-ink-muted)]">
          Recommended: 200×200px PNG or SVG
        </p>
      </div>
    </div>
  );
}

function DocIcon() {
  return (
    <svg viewBox="0 0 16 20" className="h-5 w-4" fill="none" aria-hidden="true">
      <path
        d="M2 2.5A1.5 1.5 0 0 1 3.5 1H10l4 4v11.5A1.5 1.5 0 0 1 12.5 18H3.5A1.5 1.5 0 0 1 2 16.5v-14Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10 1v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 20 18" className="h-[18px] w-5" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="16" height="14" stroke="currentColor" strokeWidth="1.5" rx="1.5" />
      <path d="M6 6h2M12 6h2M6 10h2M12 10h2M6 14h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg viewBox="0 0 22 16" className="h-4 w-[22px]" fill="none" aria-hidden="true">
      <rect x="1" y="2" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="11" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 8h.5M17 8h-.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 16 20" className="h-5 w-4" fill="none" aria-hidden="true">
      <path
        d="M8 1.5c3.6 0 6.5 2.9 6.5 6.5 0 4.8-6.5 10.5-6.5 10.5S1.5 12.8 1.5 8c0-3.6 2.9-6.5 6.5-6.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="8" cy="8" r="2.25" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function ChevronDown({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={`h-4 w-4 ${className}`} fill="none" aria-hidden="true">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[color:var(--color-border-solid)]" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8.5" cy="9" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m3 16 5-5 5 5 3-3 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
