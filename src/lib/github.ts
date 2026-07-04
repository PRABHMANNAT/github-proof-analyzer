import { GitHubApiError, type GitHubEvent, type GitHubProfileBundle, type GitHubRepo, type GitHubUser } from "@/lib/types";

const GITHUB_API_BASE = "https://api.github.com";

type FetchOptions = {
  token?: string;
};

function createHeaders(token?: string): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function fetchGitHub<T>(path: string, options: FetchOptions = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${GITHUB_API_BASE}${path}`, {
      headers: createHeaders(options.token),
      next: { revalidate: 300 }
    });
  } catch {
    throw new GitHubApiError("GitHub is unreachable right now. Check the network connection and try again.", "network");
  }

  if (response.status === 404) {
    throw new GitHubApiError("GitHub username or resource was not found.", "not_found", response.status);
  }

  if (response.status === 403 && response.headers.get("x-ratelimit-remaining") === "0") {
    throw new GitHubApiError("GitHub API rate limit reached. Demo data is available while the limit resets.", "rate_limited", response.status);
  }

  if (!response.ok) {
    throw new GitHubApiError(`GitHub API request failed with status ${response.status}.`, "unknown", response.status);
  }

  return (await response.json()) as T;
}

async function fetchOptional<T>(path: string, options: FetchOptions = {}): Promise<T | null> {
  try {
    return await fetchGitHub<T>(path, options);
  } catch (error) {
    if (error instanceof GitHubApiError && error.kind === "not_found") {
      return null;
    }
    throw error;
  }
}

export async function fetchGitHubUser(username: string, token?: string): Promise<GitHubUser> {
  return fetchGitHub<GitHubUser>(`/users/${encodeURIComponent(username)}`, { token });
}

export async function fetchGitHubRepos(username: string, token?: string): Promise<GitHubRepo[]> {
  return fetchGitHub<GitHubRepo[]>(`/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`, { token });
}

export async function fetchRepoReadme(owner: string, repo: string, token?: string): Promise<boolean> {
  const result = await fetchOptional<unknown>(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`, { token });
  return result !== null;
}

export async function fetchRepoLanguages(owner: string, repo: string, token?: string): Promise<Record<string, number>> {
  return fetchGitHub<Record<string, number>>(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`, { token });
}

export async function fetchPublicEvents(username: string, token?: string): Promise<GitHubEvent[]> {
  return fetchGitHub<GitHubEvent[]>(`/users/${encodeURIComponent(username)}/events/public?per_page=100`, { token });
}

export async function fetchGitHubProfileBundle(username: string, token?: string): Promise<GitHubProfileBundle> {
  const user = await fetchGitHubUser(username, token);
  const repos = await fetchGitHubRepos(username, token);
  const topRepos = repos.slice(0, 24);

  const readmeEntries = await Promise.all(
    topRepos.map(async (repo) => [repo.full_name, await fetchRepoReadme(repo.owner.login, repo.name, token)] as const)
  );

  const languageEntries = await Promise.all(
    topRepos.map(async (repo) => {
      try {
        return [repo.full_name, await fetchRepoLanguages(repo.owner.login, repo.name, token)] as const;
      } catch {
        return [repo.full_name, {}] as const;
      }
    })
  );

  const events = await fetchPublicEvents(username, token).catch(() => []);

  return {
    user,
    repos,
    readmeMap: Object.fromEntries(readmeEntries),
    languageDetails: Object.fromEntries(languageEntries),
    events
  };
}
