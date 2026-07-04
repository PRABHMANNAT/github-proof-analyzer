import {
  type ActivityEvent,
  type AnalysisMetrics,
  type AnalysisResult,
  type EvidenceLabel,
  type GitHubEvent,
  type GitHubProfileBundle,
  type GitHubRepo,
  type LanguageSummary,
  type ProofSignal,
  type RepoEvidence
} from "@/lib/types";
import { generateRecruiterReport } from "@/lib/report";

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#62e7c5",
  JavaScript: "#f7df1e",
  Python: "#6aa6f8",
  Java: "#f89820",
  "C#": "#a779ff",
  Go: "#66d9ef",
  Rust: "#f08b56",
  HTML: "#ff7b86",
  CSS: "#8bd17c",
  PHP: "#a98bff",
  Ruby: "#ff6f91",
  Swift: "#ffac66"
};

const now = () => Date.now();

export function formatGitHubDate(date: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(date));
}

function daysSince(date: string | null): number {
  if (!date) return Number.POSITIVE_INFINITY;
  return Math.floor((now() - new Date(date).getTime()) / 86_400_000);
}

function labelFromPoints(points: number): EvidenceLabel {
  if (points >= 9) return "Strong Evidence";
  if (points >= 5) return "Moderate Evidence";
  if (points >= 1) return "Weak Evidence";
  return "Needs Manual Review";
}

export function calculateOriginalForkRatio(repos: GitHubRepo[]) {
  const original = repos.filter((repo) => !repo.fork).length;
  const forked = repos.length - original;
  const total = Math.max(repos.length, 1);
  const originalPercent = Math.round((original / total) * 100);
  const forkedPercent = 100 - originalPercent;

  return {
    original,
    forked,
    originalPercent,
    forkedPercent,
    interpretation:
      originalPercent >= 65
        ? "High original ratio can be a stronger ownership signal when repositories show meaningful implementation evidence."
        : "A high fork ratio needs manual review. Forks can reflect learning, contributions, experiments, or copied context."
  };
}

export function detectReadmeCoverage(repos: GitHubRepo[], readmeMap: Record<string, boolean>): number {
  return repos.filter((repo) => readmeMap[repo.full_name]).length;
}

export function analyzeRepositories(repos: GitHubRepo[], readmeMap: Record<string, boolean> = {}): RepoEvidence[] {
  return repos.map((repo) => {
    let points = 0;
    const reasons: string[] = [];
    const reviewNotes: string[] = [];
    const updatedDays = daysSince(repo.pushed_at ?? repo.updated_at);
    const hasReadme = Boolean(readmeMap[repo.full_name]);
    const hasDescription = Boolean(repo.description?.trim());
    const hasHomepage = Boolean(repo.homepage?.trim());

    if (!repo.fork) {
      points += 3;
      reasons.push("Original repository ownership signal");
    } else {
      points -= 1;
      reviewNotes.push("Forked repository; inspect contribution context manually");
    }

    if (hasReadme) {
      points += 2;
      reasons.push("README is present");
    } else {
      points -= 1;
      reviewNotes.push("README not detected");
    }

    if (hasDescription) {
      points += 1;
      reasons.push("Clear repository description");
    } else {
      points -= 1;
      reviewNotes.push("Missing description");
    }

    if (updatedDays <= 90) {
      points += 3;
      reasons.push("Updated within 90 days");
    } else if (updatedDays <= 180) {
      points += 2;
      reasons.push("Updated within 180 days");
    } else if (updatedDays > 540) {
      points -= 2;
      reviewNotes.push("No recent public update detected");
    }

    if (repo.stargazers_count > 0) {
      points += 1;
      reasons.push("Has public stars");
    }

    if (repo.forks_count > 0) {
      points += 1;
      reasons.push("Has public forks");
    }

    if (hasHomepage) {
      points += 2;
      reasons.push("Includes homepage or demo link");
    }

    if (repo.size > 500) {
      points += 1;
      reasons.push("Repository size suggests non-trivial implementation");
    } else if (repo.size < 50) {
      reviewNotes.push("Very small repository; inspect substance manually");
    }

    if (repo.archived) {
      points -= 2;
      reviewNotes.push("Repository is archived");
    }

    return {
      repo,
      points,
      label: labelFromPoints(points),
      reasons,
      reviewNotes,
      hasReadme,
      hasHomepage,
      isRecentlyUpdated: updatedDays <= 180
    };
  });
}

export function calculateLanguageDepth(
  repos: GitHubRepo[],
  languageDetails: Record<string, Record<string, number>> = {}
): LanguageSummary {
  const languageMap = new Map<string, { repositories: number; bytes: number }>();

  repos
    .filter((repo) => !repo.fork)
    .forEach((repo) => {
      const byteEntries = Object.entries(languageDetails[repo.full_name] ?? {});
      if (byteEntries.length > 0) {
        byteEntries.forEach(([name, bytes]) => {
          const current = languageMap.get(name) ?? { repositories: 0, bytes: 0 };
          languageMap.set(name, { repositories: current.repositories + 1, bytes: current.bytes + bytes });
        });
        return;
      }

      if (repo.language) {
        const current = languageMap.get(repo.language) ?? { repositories: 0, bytes: 0 };
        languageMap.set(repo.language, { repositories: current.repositories + 1, bytes: current.bytes });
      }
    });

  const languages = [...languageMap.entries()]
    .map(([name, value]) => ({
      name,
      repositories: value.repositories,
      bytes: value.bytes,
      color: LANGUAGE_COLORS[name] ?? "#9aa4b2"
    }))
    .sort((a, b) => b.bytes - a.bytes || b.repositories - a.repositories);

  const primaryLanguage = languages[0]?.name ?? "Unknown";
  const topRepoCount = languages[0]?.repositories ?? 0;
  const consistency =
    languages.length === 0 ? "Unknown" : topRepoCount >= 3 ? "Strong depth" : languages.length >= 5 ? "Broad exploration" : "Unknown";
  const insight =
    consistency === "Strong depth"
      ? `Strong depth: repeated ${primaryLanguage} usage across multiple original repositories.`
      : consistency === "Broad exploration"
        ? "Broad exploration: several languages appear, with limited repeated depth in one stack."
        : "Unknown: insufficient public language data to infer depth.";

  return { languages, primaryLanguage, consistency, insight };
}

export function findStrongestRepos(repos: GitHubRepo[], readmeMap: Record<string, boolean> = {}): RepoEvidence[] {
  return analyzeRepositories(repos, readmeMap)
    .sort((a, b) => b.points - a.points || b.repo.stargazers_count - a.repo.stargazers_count)
    .slice(0, 5);
}

export function generateProofSignals(analysis: Pick<AnalysisResult, "metrics" | "languageSummary" | "activity">): ProofSignal[] {
  const signals: ProofSignal[] = [];
  const metrics = analysis.metrics;

  if (metrics.originalRepos >= 3) {
    signals.push({
      title: "Multiple original repositories",
      description: `${metrics.originalRepos} public repositories appear to be original work.`,
      strength: "strong"
    });
  }

  if (metrics.recentlyUpdatedRepos >= 2) {
    signals.push({
      title: "Recent public maintenance",
      description: `${metrics.recentlyUpdatedRepos} repositories were updated within the last 180 days.`,
      strength: "strong"
    });
  }

  if (metrics.reposWithReadme >= Math.ceil(metrics.totalRepos * 0.5)) {
    signals.push({
      title: "Documentation coverage",
      description: "README files are present on a meaningful share of analyzed repositories.",
      strength: "strong"
    });
  }

  if (analysis.languageSummary.consistency === "Strong depth") {
    signals.push({
      title: "Consistent language depth",
      description: analysis.languageSummary.insight,
      strength: "strong"
    });
  }

  if (analysis.activity.length > 0) {
    signals.push({
      title: "Recent public activity",
      description: "Public GitHub events are visible in the recent activity feed.",
      strength: "strong"
    });
  }

  return signals.length > 0
    ? signals
    : [{ title: "Limited public evidence", description: "The public profile has limited visible evidence and needs manual review.", strength: "neutral" }];
}

export function generateReviewWarnings(analysis: Pick<AnalysisResult, "metrics" | "originalForkRatio">): ProofSignal[] {
  const warnings: ProofSignal[] = [];
  const metrics = analysis.metrics;

  if (analysis.originalForkRatio.forked > analysis.originalForkRatio.original) {
    warnings.push({
      title: "Fork-heavy profile",
      description: "Forks outnumber original repositories. Review contribution context manually.",
      strength: "review"
    });
  }

  if (metrics.reposWithReadme < Math.ceil(metrics.totalRepos * 0.35)) {
    warnings.push({
      title: "README coverage is limited",
      description: "Several repositories may require manual inspection because documentation is missing.",
      strength: "review"
    });
  }

  if (metrics.archivedRepos > 0) {
    warnings.push({
      title: "Archived repositories present",
      description: `${metrics.archivedRepos} repositories are archived and may not represent current work.`,
      strength: "review"
    });
  }

  if (metrics.recentlyUpdatedRepos === 0 && metrics.totalRepos > 0) {
    warnings.push({
      title: "No recent repository updates detected",
      description: "Public GitHub evidence may not reflect recent private or non-GitHub work.",
      strength: "review"
    });
  }

  return warnings;
}

function normalizeActivity(events: GitHubEvent[]): ActivityEvent[] {
  return events
    .filter((event) => ["PushEvent", "PullRequestEvent", "IssuesEvent", "CreateEvent", "ForkEvent", "WatchEvent"].includes(event.type))
    .slice(0, 30)
    .map((event) => ({
      id: event.id,
      type: event.type,
      repoName: event.repo.name,
      createdAt: event.created_at,
      description: describeEvent(event)
    }));
}

function describeEvent(event: GitHubEvent): string {
  switch (event.type) {
    case "PushEvent":
      return `Pushed ${event.payload?.commits?.length ?? 1} commit(s)`;
    case "PullRequestEvent":
      return `${event.payload?.action ?? "Updated"} a pull request`;
    case "IssuesEvent":
      return `${event.payload?.action ?? "Updated"} an issue`;
    case "CreateEvent":
      return `Created ${event.payload?.ref_type ?? "a GitHub resource"}`;
    case "ForkEvent":
      return "Forked a repository";
    case "WatchEvent":
      return "Starred a repository";
    default:
      return event.type.replace("Event", "");
  }
}

function groupActivityByDate(activity: ActivityEvent[]) {
  const counts = new Map<string, number>();
  activity.forEach((event) => {
    const date = event.createdAt.slice(0, 10);
    counts.set(date, (counts.get(date) ?? 0) + 1);
  });
  return [...counts.entries()].map(([date, count]) => ({ date, count })).slice(0, 14);
}

function calculateMetrics(repos: GitHubRepo[], repoEvidence: RepoEvidence[], languageSummary: LanguageSummary): AnalysisMetrics {
  return {
    totalRepos: repos.length,
    originalRepos: repos.filter((repo) => !repo.fork).length,
    forkedRepos: repos.filter((repo) => repo.fork).length,
    reposWithDescriptions: repos.filter((repo) => Boolean(repo.description?.trim())).length,
    reposWithReadme: repoEvidence.filter((evidence) => evidence.hasReadme).length,
    recentlyUpdatedRepos: repoEvidence.filter((evidence) => evidence.isRecentlyUpdated).length,
    archivedRepos: repos.filter((repo) => repo.archived).length,
    totalStars: repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
    totalForks: repos.reduce((sum, repo) => sum + repo.forks_count, 0),
    primaryLanguage: languageSummary.primaryLanguage
  };
}

export function analyzeProfileBundle(bundle: GitHubProfileBundle, usedDemoData = false): AnalysisResult {
  const repoEvidence = analyzeRepositories(bundle.repos, bundle.readmeMap);
  const languageSummary = calculateLanguageDepth(bundle.repos, bundle.languageDetails);
  const metrics = calculateMetrics(bundle.repos, repoEvidence, languageSummary);
  const originalForkRatio = calculateOriginalForkRatio(bundle.repos);
  const activity = normalizeActivity(bundle.events);
  const activityByDate = groupActivityByDate(activity);
  const partial = { metrics, originalForkRatio, languageSummary, activity };
  const proofSignals = generateProofSignals(partial);
  const reviewWarnings = generateReviewWarnings(partial);
  const strongestRepos = repoEvidence
    .toSorted((a, b) => b.points - a.points || b.repo.stargazers_count - a.repo.stargazers_count)
    .slice(0, 5);

  const resultWithoutReport = {
    user: bundle.user,
    repos: bundle.repos,
    repoEvidence,
    metrics,
    originalForkRatio,
    languageSummary,
    strongestRepos,
    activity,
    activityByDate,
    proofSignals,
    reviewWarnings,
    usedDemoData,
    limitationNote: "GitHub public events are limited and may not represent the full contribution history."
  } satisfies Omit<AnalysisResult, "report">;

  return {
    ...resultWithoutReport,
    report: generateRecruiterReport(resultWithoutReport)
  };
}
