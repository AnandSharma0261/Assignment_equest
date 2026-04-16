type Stat = {
  label: string;
  value: string | number;
  hint?: string;
  hintTone?: 'blue' | 'green' | 'amber';
};

export default function StatsBento({
  stats,
  profile,
}: {
  stats: Stat[];
  profile: { value: number; label: string };
}) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <StatCard key={s.label} stat={s} />
      ))}
      <ProfileStrengthCard value={profile.value} label={profile.label} />
    </div>
  );
}

function StatCard({ stat }: { stat: Stat }) {
  const hintColor = {
    blue: 'var(--color-brand-700)',
    green: 'var(--color-success)',
    amber: '#943700',
  }[stat.hintTone || 'blue'];

  return (
    <div
      className="flex flex-col gap-2 rounded-[8px] bg-white p-6"
      style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}
    >
      <p className="text-xs font-medium uppercase tracking-[0.6px] text-[color:var(--color-ink-muted)]">
        {stat.label}
      </p>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold leading-9 text-ink">{stat.value}</span>
        {stat.hint && (
          <span
            className="pb-1 text-xs font-semibold"
            style={{ color: hintColor }}
          >
            {stat.hint}
          </span>
        )}
      </div>
    </div>
  );
}

function ProfileStrengthCard({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="relative flex flex-col gap-2 overflow-hidden rounded-[8px] bg-[color:var(--color-brand-700)] p-6"
      style={{
        boxShadow:
          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <p className="text-xs font-medium uppercase tracking-[0.6px] text-white/80">
        {label}
      </p>
      <div className="flex items-center gap-4">
        <span className="text-3xl font-bold leading-9 text-white">{value}%</span>
        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/20">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-white transition-all"
            style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -bottom-4 h-28 w-28 opacity-10"
      >
        <svg viewBox="0 0 120 120" fill="currentColor" className="h-full w-full text-white">
          <path d="M60 0 L120 60 L60 120 L0 60 Z" />
        </svg>
      </div>
    </div>
  );
}
