import { NextResponse } from "next/server";
import { analyzeProfileBundle } from "@/lib/analyzer";
import { demoProfileBundle } from "@/lib/demo-data";
import { fetchGitHubProfileBundle } from "@/lib/github";
import { GitHubApiError } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username")?.trim().replace(/^@/, "");

  if (!username) {
    return NextResponse.json({ error: "Enter a GitHub username to analyze.", kind: "missing_username" }, { status: 400 });
  }

  if (username.toLowerCase() === "demo") {
    return NextResponse.json(analyzeProfileBundle(demoProfileBundle, true));
  }

  try {
    const bundle = await fetchGitHubProfileBundle(username, process.env.GITHUB_TOKEN);
    return NextResponse.json(analyzeProfileBundle(bundle));
  } catch (error) {
    if (error instanceof GitHubApiError) {
      if (error.kind === "rate_limited") {
        return NextResponse.json(analyzeProfileBundle(demoProfileBundle, true));
      }
      return NextResponse.json({ error: error.message, kind: error.kind }, { status: error.status ?? 500 });
    }

    return NextResponse.json({ error: "Unexpected analysis failure.", kind: "unknown" }, { status: 500 });
  }
}
