import type { AnalysisResult, RecruiterReport } from "@/lib/types";

type ReportInput = Omit<AnalysisResult, "report">;

export function generateRecruiterReport(analysis: ReportInput): RecruiterReport {
  const { user, metrics, languageSummary, strongestRepos, proofSignals, reviewWarnings } = analysis;
  const strengths = proofSignals.map((signal) => signal.description);
  const evidenceGaps = reviewWarnings.length > 0 ? reviewWarnings.map((warning) => warning.description) : ["No major public-evidence gaps were detected, but manual review is still recommended."];
  const bestRepositories = strongestRepos.map((evidence) => ({
    name: evidence.repo.name,
    url: evidence.repo.html_url,
    why: evidence.reasons.slice(0, 3).join("; ") || "Selected from available public repository evidence."
  }));

  const summary =
    metrics.totalRepos === 0
      ? `This profile has no public repositories visible, so public GitHub evidence is limited and manual review is required.`
      : `This profile shows ${metrics.originalRepos} original repositories, ${metrics.recentlyUpdatedRepos} recently maintained repositories, and ${languageSummary.primaryLanguage} as the leading public language signal. The evidence should be reviewed as public portfolio context, not as a talent score.`;

  return {
    username: user.login,
    summary,
    strengths,
    evidenceGaps,
    bestRepositories,
    interviewQuestions: [
      `Which ${languageSummary.primaryLanguage} project best represents your current engineering approach?`,
      "Which repository required the most design or debugging tradeoffs?",
      "How do you decide what to document in README files?",
      "Which public project is least representative of your current ability, and why?"
    ],
    manualReviewSteps: [
      "Open the strongest original repositories and inspect README quality, commit history, and code organization.",
      "Check whether forked repositories include meaningful original contributions.",
      "Review open issues, demos, and project completeness before drawing conclusions.",
      "Ask about private, work, school, or non-GitHub projects that are not visible publicly."
    ]
  };
}

export function exportReportToMarkdown(report: RecruiterReport): string {
  const bestRepos = report.bestRepositories.length
    ? report.bestRepositories.map((repo) => `- [${repo.name}](${repo.url}) - ${repo.why}`).join("\n")
    : "- No public repositories were strong enough to highlight automatically.";

  return `# GitHub Evidence Report: ${report.username}

## Summary
${report.summary}

## Strengths
${report.strengths.map((item) => `- ${item}`).join("\n")}

## Evidence Gaps
${report.evidenceGaps.map((item) => `- ${item}`).join("\n")}

## Best Repositories to Review
${bestRepos}

## Suggested Interview Questions
${report.interviewQuestions.map((item) => `- ${item}`).join("\n")}

## Suggested Manual Review Steps
${report.manualReviewSteps.map((item) => `- ${item}`).join("\n")}

## Ethical Note
This report does not judge talent, intelligence, or hireability. It organizes visible public GitHub evidence and highlights where manual review is needed.
`;
}
