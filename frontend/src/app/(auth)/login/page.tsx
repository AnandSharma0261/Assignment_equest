'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import AuthCard, {
  AuthHeader,
  RoleToggle,
  Field,
  TextInput,
  PrimaryButton,
} from '@/components/AuthCard';
import { api, ApiError } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const initialRole = (sp.get('role') === 'employer' ? 'employer' : 'seeker') as
    | 'seeker'
    | 'employer';

  const [role, setRole] = useState<'seeker' | 'employer'>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { user } = await api.login({ email, password });
      if (user.role !== role) {
        setError(
          `This account is registered as a ${user.role}. Switch the toggle and try again.`,
        );
        return;
      }
      router.push(user.role === 'employer' ? '/employer' : '/jobs');
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex justify-center">
        <Logo size="md" />
      </div>

      <AuthCard>
        <AuthHeader
          title="Welcome Back"
          subtitle="Sign in to access your curated career gallery."
        />

        <RoleToggle value={role} onChange={setRole} />

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Field id="email" label="Email Address">
            <TextInput
              id="email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="name@company.com"
              autoComplete="email"
              required
              disabled={loading}
            />
          </Field>

          <Field
            id="password"
            label="Password"
            rightSlot={
              <Link
                href="#"
                className="text-xs font-semibold text-[color:var(--color-brand-700)] hover:underline"
              >
                Forgot?
              </Link>
            }
          >
            <TextInput
              id="password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </Field>

          <label className="flex items-center gap-3 text-sm text-[color:var(--color-ink-muted)]">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded-[4px] border border-[color:var(--color-border)] accent-[color:var(--color-brand-600)]"
            />
            Keep me signed in
          </label>

          {error && (
            <div
              role="alert"
              className="rounded-md border border-[color:var(--color-danger)]/20 bg-[color:var(--color-danger)]/5 px-4 py-3 text-sm text-[color:var(--color-danger)]"
            >
              {error}
            </div>
          )}

          <PrimaryButton loading={loading}>Sign In</PrimaryButton>
        </form>

        <div className="flex flex-col gap-6 border-t border-[color:var(--color-border-faint)] pt-8">
          <div className="relative flex items-center justify-center">
            <span className="text-xs font-bold tracking-[1.2px] text-[color:var(--color-ink-muted)] uppercase">
              Or continue with
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <OAuthButton provider="google" />
            <OAuthButton provider="github" />
          </div>

          <p className="text-center text-sm text-[color:var(--color-ink-muted)]">
            Don&apos;t have an account?{' '}
            <Link
              href={`/register?role=${role}`}
              className="font-semibold text-[color:var(--color-brand-700)] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </AuthCard>

      <LoginStats />
    </>
  );
}

function OAuthButton({ provider }: { provider: 'google' | 'github' }) {
  const label = provider === 'google' ? 'Google' : 'GitHub';
  return (
    <button
      type="button"
      disabled
      title="OAuth is design-only for this assignment"
      className="flex h-12 w-full items-center justify-center gap-3 rounded-[8px] bg-[color:var(--color-button-soft)] text-base font-medium text-ink opacity-90 cursor-not-allowed"
    >
      {provider === 'google' ? <GoogleGlyph /> : <GithubGlyph />}
      {label}
    </button>
  );
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 0 1-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.75 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.56-2.77c-.99.67-2.26 1.07-3.72 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.12a6.6 6.6 0 0 1 0-4.23V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.83Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.4 14.97.5 12 .5A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.29 9.14 4.75 12 4.75Z"
      />
    </svg>
  );
}

function GithubGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#191C1E"
        d="M12 .5A12 12 0 0 0 0 12.5c0 5.3 3.44 9.8 8.2 11.4.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.6-4.04-1.6-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.85 2.81 1.31 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.31-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.23-3.24-.12-.3-.53-1.53.12-3.18 0 0 1-.32 3.3 1.23a11.38 11.38 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.88.12 3.18.77.85 1.23 1.92 1.23 3.24 0 4.64-2.8 5.65-5.48 5.95.43.38.82 1.12.82 2.26v3.35c0 .32.22.7.83.58A12 12 0 0 0 24 12.5 12 12 0 0 0 12 .5Z"
      />
    </svg>
  );
}

function LoginStats() {
  const stats = [
    { value: '12k+', label: 'Curated Jobs' },
    { value: '500+', label: 'Top Employers' },
    { value: '24h', label: 'Avg. Response' },
  ];
  return (
    <div className="grid grid-cols-3 gap-4 opacity-60">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col items-center">
          <span className="text-xl font-bold text-ink">{s.value}</span>
          <span className="text-xs font-medium text-[color:var(--color-ink-muted)]">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
