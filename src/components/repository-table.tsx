import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { formatGitHubDate } from "@/lib/analyzer";
import type { EvidenceLabel, RepoEvidence } from "@/lib/types";

type RepositoryTableProps = {
  evidence: RepoEvidence[];
};

const labelStyles: Record<EvidenceLabel, string> = {
  "Strong Evidence": "border-emerald-300/25 bg-emerald-300/10 text-emerald-100",
  "Moderate Evidence": "border-sky-300/25 bg-sky-300/10 text-sky-100",
  "Weak Evidence": "border-amber-300/25 bg-amber-300/10 text-amber-100",
  "Needs Manual Review": "border-slate-300/20 bg-slate-300/10 text-slate-200"
};

export function RepositoryTable({ evidence }: RepositoryTableProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#10131b]/80">
      <div className="border-b border-white/10 p-5">
        <h2 className="text-2xl font-semibold text-white">Repository evidence table</h2>
        <p className="mt-2 text-sm text-slate-400">
          Evidence labels are transparent heuristics based on public metadata and should be manually reviewed.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] border-collapse text-left text-sm">
          <thead className="bg-white/[0.03] text-xs uppercase tracking-[0.16em] text-slate-500">
            <tr>
              <th className="px-5 py-4 font-medium">Repo</th>
              <th className="px-5 py-4 font-medium">Language</th>
              <th className="px-5 py-4 font-medium">Stars</th>
              <th className="px-5 py-4 font-medium">Forks</th>
              <th className="px-5 py-4 font-medium">Updated</th>
              <th className="px-5 py-4 font-medium">Origin</th>
              <th className="px-5 py-4 font-medium">README</th>
              <th className="px-5 py-4 font-medium">Demo</th>
              <th className="px-5 py-4 font-medium">Size</th>
              <th className="px-5 py-4 font-medium">Issues</th>
              <th className="px-5 py-4 font-medium">Evidence</th>
            </tr>
          </thead>
          <tbody>
            {evidence.map((item) => (
              <tr key={item.repo.id} className="border-t border-white/10 align-top">
                <td className="max-w-[22rem] px-5 py-4">
                  <Link href={item.repo.html_url} className="inline-flex items-center gap-2 font-medium text-white hover:text-[var(--accent)]">
                    {item.repo.name}
                    <ExternalLink size={13} aria-hidden="true" />
                  </Link>
                  <p className="mt-1 line-clamp-2 text-slate-500">{item.repo.description || "No description provided."}</p>
                </td>
                <td className="px-5 py-4 text-slate-300">{item.repo.language || "Unknown"}</td>
                <td className="px-5 py-4 text-slate-300">{item.repo.stargazers_count}</td>
                <td className="px-5 py-4 text-slate-300">{item.repo.forks_count}</td>
                <td className="px-5 py-4 text-slate-300">{formatGitHubDate(item.repo.pushed_at ?? item.repo.updated_at)}</td>
                <td className="px-5 py-4 text-slate-300">{item.repo.fork ? "Fork" : "Original"}</td>
                <td className="px-5 py-4 text-slate-300">{item.hasReadme ? "Yes" : "No"}</td>
                <td className="px-5 py-4 text-slate-300">{item.hasHomepage ? "Yes" : "No"}</td>
                <td className="px-5 py-4 text-slate-300">{item.repo.size.toLocaleString()} KB</td>
                <td className="px-5 py-4 text-slate-300">{item.repo.open_issues_count}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${labelStyles[item.label]}`}>
                    {item.label}
                  </span>
                  <p className="mt-2 max-w-[16rem] text-xs leading-5 text-slate-500">
                    {[...item.reasons.slice(0, 2), ...item.reviewNotes.slice(0, 1)].join("; ") || "Manual review recommended."}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
