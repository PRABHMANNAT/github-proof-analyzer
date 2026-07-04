import Link from "next/link";
import { ExternalLink, Rocket } from "lucide-react";
import type { RepoEvidence } from "@/lib/types";

type StrongestReposProps = {
  repos: RepoEvidence[];
};

export function StrongestRepos({ repos }: StrongestReposProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#10131b]/80 p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h2 className="text-2xl font-semibold text-white">Top 5 strongest repositories</h2>
          <p className="mt-2 text-sm text-slate-400">
            Selected with a transparent evidence-strength heuristic. This is not a talent score.
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        {repos.map((item) => (
          <article key={item.repo.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <Rocket size={18} className="text-[var(--accent)]" aria-hidden="true" />
            <h3 className="mt-4 font-semibold text-white">{item.repo.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {item.reasons.slice(0, 3).join("; ") || "Selected from available public metadata."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.reasons.slice(0, 3).map((reason) => (
                <span key={reason} className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-300">
                  {reason}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-col gap-2 text-sm">
              <Link href={item.repo.html_url} className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-white">
                GitHub
                <ExternalLink size={13} aria-hidden="true" />
              </Link>
              {item.repo.homepage ? (
                <Link href={item.repo.homepage} className="inline-flex items-center gap-2 text-slate-300 hover:text-white">
                  Homepage
                  <ExternalLink size={13} aria-hidden="true" />
                </Link>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
