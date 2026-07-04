"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Archive, BookOpenCheck, Code2, GitFork, GitPullRequest, Star, TableProperties, TimerReset } from "lucide-react";
import { MetricCard } from "@/components/metric-card";
import { ForkRatioChart } from "@/components/fork-ratio-chart";
import { LanguageChart } from "@/components/language-chart";
import { ActivityTimeline } from "@/components/activity-timeline";
import { ProfileCard } from "@/components/profile-card";
import { ProofSignalsPanel } from "@/components/proof-signals-panel";
import { RepositoryTable } from "@/components/repository-table";
import { StrongestRepos } from "@/components/strongest-repos";
import { UsernameSearch } from "@/components/username-search";
import type { AnalysisResult } from "@/lib/types";

type ApiError = {
  error: string;
  kind: string;
};

export function AnalyzeWorkspace() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username") ?? "";
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!username) return;

    let cancelled = false;

    async function runAnalysis() {
      await Promise.resolve();
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/analyze?username=${encodeURIComponent(username)}`);
        const payload = await response.json();
        if (!response.ok) throw payload;
        if (!cancelled) setAnalysis(payload as AnalysisResult);
      } catch (nextError) {
        if (!cancelled) {
          setAnalysis(null);
          setError(nextError as ApiError);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void runAnalysis();

    return () => {
      cancelled = true;
    };
  }, [username]);

  const metricCards = useMemo(() => {
    if (!analysis) return [];
    const metrics = analysis.metrics;
    return [
      { label: "Total repositories", value: metrics.totalRepos, icon: TableProperties, detail: "Public repositories returned by GitHub." },
      { label: "Original repositories", value: metrics.originalRepos, icon: GitPullRequest, detail: "Public repos that are not forks." },
      { label: "Forked repositories", value: metrics.forkedRepos, icon: GitFork, detail: "Needs context, not automatically negative." },
      { label: "With descriptions", value: metrics.reposWithDescriptions, icon: BookOpenCheck, detail: "Repos with visible project summaries." },
      { label: "With README", value: metrics.reposWithReadme, icon: BookOpenCheck, detail: "Checked for top updated repositories." },
      { label: "Recently updated", value: metrics.recentlyUpdatedRepos, icon: TimerReset, detail: "Updated in the last 180 days." },
      { label: "Archived", value: metrics.archivedRepos, icon: Archive, detail: "May represent older work." },
      { label: "Stars / forks", value: `${metrics.totalStars} / ${metrics.totalForks}`, icon: Star, detail: "Public attention signals." },
      { label: "Primary language", value: metrics.primaryLanguage, icon: Code2, detail: "From original repositories." }
    ];
  }, [analysis]);

  return (
    <div className="mx-auto max-w-7xl">
      <section className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Analyze profile</p>
          <h1 className="mt-3 text-4xl font-semibold text-white md:text-5xl">GitHub evidence dashboard</h1>
          <p className="mt-4 max-w-2xl text-slate-400">
            Enter a username to convert public repositories, events, and project metadata into transparent proof signals.
          </p>
        </div>
        <UsernameSearch compact defaultValue={username} />
      </section>

      {!username ? <EmptyState /> : null}
      {loading ? <LoadingSkeleton /> : null}
      {error ? <ErrorState message={error.error} /> : null}

      {analysis && !loading ? (
        <div className="mt-8 space-y-8">
          <ProfileCard user={analysis.user} />
          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">Repository quality overview</h2>
                <p className="mt-2 text-sm text-slate-400">Counts are public evidence indicators, not talent scores.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {metricCards.map((card) => (
                <MetricCard key={card.label} {...card} />
              ))}
            </div>
          </section>
          <div className="grid gap-6 xl:grid-cols-2">
            <ForkRatioChart ratio={analysis.originalForkRatio} />
            <LanguageChart summary={analysis.languageSummary} />
          </div>
          <ActivityTimeline
            activity={analysis.activity}
            activityByDate={analysis.activityByDate}
            limitationNote={analysis.limitationNote}
          />
          <ProofSignalsPanel signals={analysis.proofSignals} warnings={analysis.reviewWarnings} />
          <StrongestRepos repos={analysis.strongestRepos} />
          <RepositoryTable evidence={analysis.repoEvidence} />
        </div>
      ) : null}
    </div>
  );
}

function EmptyState() {
  return (
    <section className="mt-10 rounded-2xl border border-dashed border-white/15 bg-white/[0.025] p-10 text-center">
      <h2 className="text-2xl font-semibold text-white">Start with a public GitHub username</h2>
      <p className="mx-auto mt-3 max-w-2xl text-slate-400">
        Empty searches route to demo mode from the landing page. This workspace waits for a username so the dashboard stays explicit.
      </p>
    </section>
  );
}

function LoadingSkeleton() {
  return (
    <div className="mt-8 space-y-6" aria-label="Loading analysis">
      <div className="h-44 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <div key={index} className="h-36 animate-pulse rounded-xl border border-white/10 bg-white/[0.035]" />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <section className="mt-10 rounded-2xl border border-red-400/20 bg-red-400/[0.08] p-6">
      <h2 className="text-xl font-semibold text-white">Analysis could not complete</h2>
      <p className="mt-2 text-sm text-red-100/80">{message}</p>
    </section>
  );
}
