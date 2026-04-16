import type { ReactNode } from 'react';

export default function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="card-shadow w-full rounded-[8px] bg-white p-8 sm:p-12">
      <div className="flex flex-col gap-8">{children}</div>
    </div>
  );
}

export function AuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <h1
        className="text-[32px] font-bold text-ink sm:text-[44px] sm:leading-[55px]"
        style={{ letterSpacing: '-1.1px' }}
      >
        {title}
      </h1>
      <p className="text-base leading-[26px] text-[color:var(--color-ink-muted)]">
        {subtitle}
      </p>
    </div>
  );
}

export function RoleToggle({
  value,
  onChange,
}: {
  value: 'seeker' | 'employer';
  onChange: (v: 'seeker' | 'employer') => void;
}) {
  return (
    <div className="flex rounded-[12px] bg-[color:var(--color-toggle)] p-1">
      <ToggleButton active={value === 'seeker'} onClick={() => onChange('seeker')}>
        Job Seeker
      </ToggleButton>
      <ToggleButton active={value === 'employer'} onClick={() => onChange('employer')}>
        Employer
      </ToggleButton>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-[8px] px-6 py-3 text-sm transition-all ${
        active
          ? 'bg-white font-semibold text-[color:var(--color-brand-700)] shadow-[0_1px_2px_rgba(0,0,0,0.05)]'
          : 'font-medium text-[color:var(--color-ink-muted)] hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}

export function Field({
  id,
  label,
  rightSlot,
  children,
}: {
  id: string;
  label: string;
  rightSlot?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <label
          htmlFor={id}
          className="text-xs font-medium text-[color:var(--color-ink-muted)]"
        >
          {label}
        </label>
        {rightSlot}
      </div>
      {children}
    </div>
  );
}

export function TextInput({
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
  disabled,
}: {
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoComplete={autoComplete}
      required={required}
      disabled={disabled}
      className="h-[53px] w-full rounded-[8px] border border-[color:var(--color-border)] bg-white px-4 text-base outline-none transition-all placeholder:text-[color:var(--color-ink-placeholder)] focus:border-[color:var(--color-brand-600)] focus:ring-2 focus:ring-[color:var(--color-brand-600)]/20 disabled:opacity-60"
    />
  );
}

export function PrimaryButton({
  children,
  type = 'submit',
  loading,
  disabled,
  onClick,
}: {
  children: ReactNode;
  type?: 'button' | 'submit';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="cta-gradient cta-shadow inline-flex h-14 w-full items-center justify-center rounded-[8px] text-base font-semibold text-white transition-transform hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Spinner /> Signing in…
        </span>
      ) : (
        children
      )}
    </button>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
