'use client';

import { use, useState } from 'react';
import { useRouter, notFound } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import SiteFooter from '@/components/SiteFooter';
import AuthCard, {
  AuthHeader,
  Field,
  TextInput,
  PrimaryButton,
} from '@/components/AuthCard';
import { api, ApiError } from '@/lib/api';

export default function RegisterFormPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role: roleParam } = use(params);
  if (roleParam !== 'seeker' && roleParam !== 'employer') notFound();
  const role = roleParam as 'seeker' | 'employer';

  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { user } = await api.register({
        name,
        email,
        password,
        role,
        company: role === 'employer' ? company : undefined,
      });
      router.push(user.role === 'employer' ? '/employer' : '/jobs');
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const copy =
    role === 'seeker'
      ? {
          title: 'Create your candidate profile',
          subtitle: 'Start applying to curated roles in minutes.',
        }
      : {
          title: 'Create your employer account',
          subtitle: 'Post roles and manage applications from one dashboard.',
        };

  return (
    <>
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="flex w-full max-w-[576px] flex-col items-stretch gap-10">
          <div className="flex justify-center">
            <Logo size="md" variant="solid" />
          </div>

          <AuthCard>
            <AuthHeader title={copy.title} subtitle={copy.subtitle} />

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <Field id="name" label="Full Name">
                <TextInput
                  id="name"
                  value={name}
                  onChange={setName}
                  placeholder="Ananya Sharma"
                  autoComplete="name"
                  required
                  disabled={loading}
                />
              </Field>

              {role === 'employer' && (
                <Field id="company" label="Company Name">
                  <TextInput
                    id="company"
                    value={company}
                    onChange={setCompany}
                    placeholder="Acme Corp"
                    autoComplete="organization"
                    required
                    disabled={loading}
                  />
                </Field>
              )}

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

              <Field id="password" label="Password">
                <TextInput
                  id="password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  required
                  disabled={loading}
                />
              </Field>

              {error && (
                <div
                  role="alert"
                  className="rounded-md border border-[color:var(--color-danger)]/20 bg-[color:var(--color-danger)]/5 px-4 py-3 text-sm text-[color:var(--color-danger)]"
                >
                  {error}
                </div>
              )}

              <PrimaryButton loading={loading}>Create Account</PrimaryButton>
            </form>

            <p className="text-center text-sm text-[color:var(--color-ink-muted)]">
              Already have an account?{' '}
              <Link
                href={`/login?role=${role}`}
                className="font-semibold text-[color:var(--color-brand-700)] hover:underline"
              >
                Log in here
              </Link>
            </p>
          </AuthCard>

          <p className="text-center text-sm text-[color:var(--color-ink-muted)]">
            Not a {role === 'seeker' ? 'candidate' : 'employer'}?{' '}
            <Link
              href={role === 'seeker' ? '/register/employer' : '/register/seeker'}
              className="font-medium text-[color:var(--color-brand-700)] hover:underline"
            >
              Switch to the {role === 'seeker' ? 'employer' : 'candidate'} flow
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
