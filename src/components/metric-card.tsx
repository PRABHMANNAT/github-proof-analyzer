import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  detail?: string;
};

export function MetricCard({ label, value, icon: Icon, detail }: MetricCardProps) {
  return (
    <article className="rounded-xl border border-white/10 bg-white/[0.035] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
        </div>
        <span className="grid size-10 place-items-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
          <Icon size={19} aria-hidden="true" />
        </span>
      </div>
      {detail ? <p className="mt-4 text-sm text-slate-500">{detail}</p> : null}
    </article>
  );
}
