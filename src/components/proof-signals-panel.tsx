import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { ProofSignal } from "@/lib/types";

type ProofSignalsPanelProps = {
  signals: ProofSignal[];
  warnings: ProofSignal[];
};

export function ProofSignalsPanel({ signals, warnings }: ProofSignalsPanelProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <SignalGroup title="Strong public signals" items={signals} tone="strong" />
      <SignalGroup title="Review signals" items={warnings} tone="review" />
    </section>
  );
}

function SignalGroup({ title, items, tone }: { title: string; items: ProofSignal[]; tone: "strong" | "review" }) {
  const emptyMessage =
    tone === "strong"
      ? "No strong public signals were detected automatically. Manual review may still find relevant evidence."
      : "No major review warnings were detected automatically. Manual review is still recommended.";

  return (
    <div className="rounded-2xl border border-white/10 bg-[#10131b]/80 p-5">
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <div className="mt-5 space-y-3">
        {(items.length ? items : [{ title: "No automatic findings", description: emptyMessage, strength: "neutral" as const }]).map((item) => {
          const Icon = tone === "strong" ? CheckCircle2 : item.strength === "neutral" ? Info : AlertTriangle;
          return (
            <article key={`${title}-${item.title}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex gap-3">
                <Icon
                  size={19}
                  className={tone === "strong" ? "shrink-0 text-[var(--accent)]" : "shrink-0 text-[var(--warning)]"}
                  aria-hidden="true"
                />
                <div>
                  <h3 className="font-medium text-white">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{item.description}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
