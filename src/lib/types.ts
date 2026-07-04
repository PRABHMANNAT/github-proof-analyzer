export type EvidenceLabel = "Strong Evidence" | "Moderate Evidence" | "Weak Evidence" | "Needs Manual Review";

export type GitHubUser = {
  login: string;
  id: number;
  avatar_url: string | null;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
};

export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  archived: boolean;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  size: number;
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
  topics?: string[];
  owner: {
    login: string;
  };
};

export type GitHubEvent = {
  id: string;
  type: string;
  created_at: string;
  repo: {
    name: string;
    url: string;
  };
  payload?: {
    commits?: Array<{ sha: string; message: string }>;
    action?: string;
    ref_type?: string;
  };
};

export type RepoEvidence = {
  repo: GitHubRepo;
  points: number;
  label: EvidenceLabel;
  reasons: string[];
  reviewNotes: string[];
  hasReadme: boolean;
  hasHomepage: boolean;
  isRecentlyUpdated: boolean;
};

export type LanguageSummary = {
  languages: Array<{
    name: string;
    repositories: number;
    bytes: number;
    color: string;
  }>;
  primaryLanguage: string;
  consistency: "Strong depth" | "Broad exploration" | "Unknown";
  insight: string;
};

export type ActivityEvent = {
  id: string;
  type: string;
  repoName: string;
  createdAt: string;
  description: string;
};

export type ProofSignal = {
  title: string;
  description: string;
  strength: "strong" | "review" | "neutral";
};

export type AnalysisMetrics = {
  totalRepos: number;
  originalRepos: number;
  forkedRepos: number;
  reposWithDescriptions: number;
  reposWithReadme: number;
  recentlyUpdatedRepos: number;
  archivedRepos: number;
  totalStars: number;
  totalForks: number;
  primaryLanguage: string;
};

export type RecruiterReport = {
  username: string;
  summary: string;
  strengths: string[];
  evidenceGaps: string[];
  bestRepositories: Array<{
    name: string;
    url: string;
    why: string;
  }>;
  interviewQuestions: string[];
  manualReviewSteps: string[];
};

export type AnalysisResult = {
  user: GitHubUser;
  repos: GitHubRepo[];
  repoEvidence: RepoEvidence[];
  metrics: AnalysisMetrics;
  originalForkRatio: {
    original: number;
    forked: number;
    originalPercent: number;
    forkedPercent: number;
    interpretation: string;
  };
  languageSummary: LanguageSummary;
  strongestRepos: RepoEvidence[];
  activity: ActivityEvent[];
  activityByDate: Array<{ date: string; count: number }>;
  proofSignals: ProofSignal[];
  reviewWarnings: ProofSignal[];
  report: RecruiterReport;
  usedDemoData?: boolean;
  limitationNote: string;
};

export type GitHubProfileBundle = {
  user: GitHubUser;
  repos: GitHubRepo[];
  readmeMap: Record<string, boolean>;
  languageDetails: Record<string, Record<string, number>>;
  events: GitHubEvent[];
};

export type GitHubApiErrorKind = "not_found" | "rate_limited" | "network" | "unknown";

export class GitHubApiError extends Error {
  kind: GitHubApiErrorKind;
  status?: number;

  constructor(message: string, kind: GitHubApiErrorKind, status?: number) {
    super(message);
    this.name = "GitHubApiError";
    this.kind = kind;
    this.status = status;
  }
}
