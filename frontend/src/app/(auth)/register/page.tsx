import Link from 'next/link';
import Logo from '@/components/Logo';
import RoleCard from '@/components/RoleCard';
import SimpleFooter from '@/components/SimpleFooter';

export default function RegisterPickerPage() {
  return (
    <>
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-16 sm:py-24">
        <BackgroundDecoration />

        <div className="relative z-10 flex w-full max-w-[896px] flex-col gap-10">
          <div className="flex flex-col items-center gap-4">
            <Logo size="lg" variant="solid" />
            <p className="text-center text-lg font-medium text-[color:var(--color-ink-muted)]">
              Choose your journey to get started.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <RoleCard
              href="/register/seeker"
              title="I'm a Candidate"
              description="I want to discover curated career opportunities and build my professional profile to stand out to leading employers."
              cta="Get Started"
              iconFg="var(--color-brand-deep)"
              icon={<SeekerIcon />}
              pill={{ label: 'Hiring Now' }}
            />
            <RoleCard
              href="/register/employer"
              title="I'm an Employer"
              description="I'm looking to post jobs, manage applications, and connect with high-caliber talent in our specialized gallery."
              cta="Post a Job"
              iconFg="var(--color-employer-accent)"
              icon={<EmployerIcon />}
            />
          </div>

          <div className="flex flex-col items-center gap-16">
            <p className="text-base font-medium text-[color:var(--color-ink-muted)]">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-[color:var(--color-brand-700)] hover:underline"
              >
                Log in here
              </Link>
            </p>

            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium uppercase tracking-[1.2px] text-[color:var(--color-ink-muted)] opacity-50">
              <Trust icon={<ShieldCheck />} label="Verified Talent" />
              <Trust icon={<Lock />} label="Secure Platform" />
              <Trust icon={<Sparkles />} label="Editorial Curation" />
            </ul>
          </div>
        </div>
      </main>
      <SimpleFooter />
    </>
  );
}

function Trust({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="inline-flex items-center gap-2">
      <span className="text-[color:var(--color-ink-muted)]">{icon}</span>
      {label}
    </li>
  );
}

function BackgroundDecoration() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute -right-16 -top-28 h-[443px] w-[512px] rounded-full opacity-40 blur-[60px]"
        style={{ background: 'rgba(219, 225, 255, 0.4)' }}
      />
      <div className="absolute -bottom-28 -left-16 h-[443px] w-[512px] rounded-full opacity-40 blur-[60px]"
        style={{ background: 'rgba(172, 191, 255, 0.4)' }}
      />
    </div>
  );
}

function SeekerIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-[30px] w-[30px]" fill="none" aria-hidden="true">
      <circle
        cx="13"
        cy="10"
        r="5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M4 26c0-4.97 4.03-9 9-9 1.9 0 3.66.6 5.12 1.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="23" cy="22" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="m26.8 25.8 2.2 2.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EmployerIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-[30px] w-[30px]" fill="none" aria-hidden="true">
      <rect
        x="4"
        y="10"
        width="24"
        height="17"
        rx="2"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M12 10V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 17h24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="14" y="15" width="4" height="4" rx="1" fill="currentColor" />
    </svg>
  );
}

function ShieldCheck() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
      <path d="M8 1.5 2.5 3.5v4c0 3.1 2.4 6 5.5 7 3.1-1 5.5-3.9 5.5-7v-4L8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="m5.75 8.25 1.75 1.75 3-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Lock() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function Sparkles() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
      <path d="M8 2v3M8 11v3M2 8h3M11 8h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3.5 3.5 5 5M11 11l1.5 1.5M3.5 12.5 5 11M11 5l1.5-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
