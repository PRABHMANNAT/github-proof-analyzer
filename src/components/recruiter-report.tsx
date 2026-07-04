import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { MarkdownExportButton } from "@/components/markdown-export-button";
import { exportReportToMarkdown } from "@/lib/report";
import type { RecruiterReport as RecruiterReportType } from "@/lib/types";

type RecruiterReportProps = {
  report: RecruiterReportType;
};

export function RecruiterReport({ report }: RecruiterReportProps) {
  const markdown = exportReportToMarkdown(report);

  return (
    <section id="report" className="rounded-2xl border border-white/10 bg-[#10131b]/80 p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Recruiter-friendly report</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Evidence report for @{report.username}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">{report.summary}</p>
        </div>
        <MarkdownExportButton markdown={markdown} filename={`${report.username}-github-evidence-report.md`} />
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <ReportList title="Strengths" items={report.strengths} />
        <ReportList title="Evidence gaps" items={report.evidenceGaps} />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 lg:col-span-1">
          <h3 className="font-semibold text-white">Best repositories to review</h3>
          <div className="mt-4 space-y-3">
            {report.bestRepositories.map((repo) => (
              <Link key={repo.url} href={repo.url} className="block rounded-lg border border-white/10 p-3 hover:border-[var(--accent)]/35">
                <span className="inline-flex items-center gap-2 font-medium text-white">
                  {repo.name}
                  <ExternalLink size={13} aria-hidden="true" />
                </span>
                <span className="mt-1 block text-sm leading-6 text-slate-400">{repo.why}</span>
              </Link>
            ))}
          </div>
        </div>
        <ReportList title="Suggested interview questions" items={report.interviewQuestions} />
        <ReportList title="Manual review steps" items={report.manualReviewSteps} />
      </div>
    </section>
  );
}

function ReportList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <h3 className="font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-400">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
