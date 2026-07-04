# GitHub Proof Analyzer

GitHub Proof Analyzer is a proof-first developer portfolio analysis tool that organizes public GitHub evidence into recruiter-friendly signals without assigning unfair talent scores.

Screenshot placeholder: _add dashboard screenshot after deployment._

Live demo: _add deployment URL here after hosting._

## Why This Exists

GitHub profiles can contain useful evidence, but raw repository lists are hard to review quickly and easy to misread. This app converts public GitHub profile, repository, language, README, and activity data into transparent signals that help recruiters and developers discuss visible evidence with more context.

It does not judge talent, intelligence, or hireability.

## Features

- Premium dark SaaS-style landing page and dashboard
- GitHub username search powered by public REST API endpoints
- Profile overview with avatar, bio, metadata, followers, repos, and account dates
- Repository quality metrics for original repos, forks, README coverage, descriptions, recency, archive state, stars, forks, and primary language
- Original vs forked ratio chart with neutral interpretation
- Language depth chart using repository language data when available
- Repository evidence table with transparent labels and review notes
- Top 5 strongest repositories by evidence strength
- Public activity timeline using recent GitHub events
- Proof signals and review warnings written in neutral language
- Recruiter-friendly report with strengths, evidence gaps, interview questions, and manual review steps
- Copy and download Markdown export
- Recent searches stored in `localStorage`
- Demo mode and automatic demo fallback on API rate limit
- About and methodology pages
- Vitest coverage for analyzer and report logic

## Tech Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- Recharts
- Lucide React
- Vitest
- GitHub REST API
- Optional `GITHUB_TOKEN` for higher API limits

## How It Works

The server route at `src/app/api/analyze/route.ts` fetches public GitHub data, then passes it through typed utilities in `src/lib/analyzer.ts` and `src/lib/report.ts`.

REST endpoints used:

- `GET /users/{username}`
- `GET /users/{username}/repos?per_page=100&sort=updated`
- `GET /repos/{owner}/{repo}/readme`
- `GET /repos/{owner}/{repo}/languages`
- `GET /users/{username}/events/public`

If `GITHUB_TOKEN` is present, API requests include it server-side. The app works without a token but may hit public rate limits sooner.

## Methodology

Repository evidence uses a transparent heuristic:

- Original repo: `+3`
- README present: `+2`
- Description present: `+1`
- Updated within 90 days: `+3`
- Updated within 180 days: `+2`
- Stars or forks present: `+1 each`
- Homepage/demo link: `+2`
- Meaningful repository size: `+1`
- Archived repository: `-2`
- Forked repository: `-1`
- Missing README or description: `-1 each`
- Very old update: `-2`

Labels:

- `Strong Evidence`: 9+ points
- `Moderate Evidence`: 5-8 points
- `Weak Evidence`: 1-4 points
- `Needs Manual Review`: 0 or fewer points

These labels describe visible public evidence only. They are not talent scores.

## Installation

```bash
npm install
```

## Environment Variables

Create `.env.local` if you want higher GitHub API limits:

```bash
GITHUB_TOKEN=
```

No paid APIs are required.

## Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build And Quality Checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Project Structure

```text
src/
  app/
    api/analyze/route.ts
    analyze/page.tsx
    demo/page.tsx
    report/[username]/page.tsx
    about/page.tsx
    methodology/page.tsx
  components/
    activity-timeline.tsx
    analyze-workspace.tsx
    fork-ratio-chart.tsx
    language-chart.tsx
    recruiter-report.tsx
    repository-table.tsx
    strongest-repos.tsx
  lib/
    analyzer.ts
    demo-data.ts
    github.ts
    report.ts
    types.ts
```

## Deployment

Deploy on Vercel:

1. Import the GitHub repository into Vercel.
2. Keep the default Next.js build settings.
3. Optional: add `GITHUB_TOKEN` in Vercel project environment variables.
4. Deploy.

CLI option:

```bash
npx vercel
```

## Limitations

- Public GitHub activity is incomplete and may not represent full contribution history.
- Private repositories, company work, pair programming, code reviews, and non-GitHub projects are not visible.
- README and language checks are limited to top updated repositories to avoid excessive API calls.
- Forks require manual review because they can represent learning, experimentation, or real contribution work.
- Rate limits can affect live GitHub API analysis without a token.

## Ethical Note

This project does not judge talent, intelligence, or hireability. It only organizes visible public GitHub evidence and highlights where manual review is needed.

## Roadmap

- Optional GitHub GraphQL contribution history when `GITHUB_TOKEN` is available
- Shareable static report snapshots
- Repository topic and tutorial-name heuristics
- More robust language byte distribution charts
- PDF report export
- Screenshot automation for README assets

## Author

Built for the `PRABHMANNAT/github-proof-analyzer` portfolio repository.
