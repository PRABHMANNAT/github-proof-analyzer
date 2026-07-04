import Link from "next/link";
import { Activity, BarChart3, BookOpenCheck, Code2, GitFork, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { UsernameSearch } from "@/components/username-search";

const features = [
  { icon: BookOpenCheck, title: "Repository Quality", text: "README, descriptions, maintenance, completeness, and review-ready links." },
  { icon: Activity, title: "Commit Activity", text: "Recent public events and repository update signals with API limits disclosed." },
  { icon: GitFork, title: "Fork vs Original Work", text: "Ownership context without treating forks as automatically negative." },
  { icon: BarChart3, title: "Language Depth", text: "Repository and byte-level language evidence for consistency or exploration." },
  { icon: ShieldCheck, title: "Recruiter Evidence Report", text: "Markdown summaries with strengths, evidence gaps, and interview prompts." },
  { icon: Code2, title: "No Black-Box Scoring", text: "Transparent heuristics; never talent, intelligence, or hireability judgments." }
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden px-5 py-16 md:px-8 md:py-24">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(7,8,13,0.98),rgba(7,8,13,0.74)_48%,rgba(7,8,13,0.93))]" />
            <div className="absolute right-[-12rem] top-10 h-[38rem] w-[38rem] rounded-full border border-[var(--accent)]/10 bg-[radial-gradient(circle,rgba(98,231,197,0.2),transparent_60%)] blur-sm" />
            <div className="absolute bottom-0 right-0 h-80 w-[70vw] bg-[linear-gradient(135deg,transparent,rgba(98,231,197,0.09))]" />
          </div>

          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                GitHub Proof Analyzer
              </p>
              <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.02] text-white md:text-7xl">
                Turn public GitHub activity into transparent proof signals.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Evidence-first portfolio analysis for recruiters, hiring teams, and developers who want context instead of black-box scoring.
              </p>
              <div className="mt-8">
                <UsernameSearch />
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <Link href="/demo" className="font-medium text-white underline-offset-4 hover:underline">
                  View Demo Report
                </Link>
                <span>No token required. Optional token reduces rate limits.</span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0d1118]/80 p-5 shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-sm font-medium text-white">Evidence workspace</span>
                <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs text-[var(--accent)]">Transparent</span>
              </div>
              <div className="mt-5 space-y-4">
                {["Original repositories", "README coverage", "Recent maintenance", "Language depth"].map((label, index) => (
                  <div key={label} className="grid grid-cols-[9rem_1fr_auto] items-center gap-4 text-sm">
                    <span className="text-slate-400">{label}</span>
                    <span className="h-2 overflow-hidden rounded-full bg-white/8">
                      <span
                        className="block h-full rounded-full bg-[var(--accent)]"
                        style={{ width: `${86 - index * 13}%` }}
                      />
                    </span>
                    <span className="text-white">{86 - index * 13}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {["Strong public evidence", "Needs manual review", "Profile may omit private work", "No hireability judgment"].map((item) => (
                  <div key={item} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 px-5 py-16 md:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-semibold text-white">Built for proof-first hiring</h2>
            <p className="mt-4 max-w-3xl text-slate-300">
              The app organizes public evidence into explicit signals: ownership, maintenance, documentation, language depth, and review gaps. It does not judge talent or replace human review.
            </p>
          </div>
        </section>

        <section className="px-5 py-16 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="text-3xl font-semibold text-white">What it checks</h2>
                <p className="mt-3 max-w-2xl text-slate-400">
                  Public GitHub data is converted into clear, recruiter-friendly evidence.
                </p>
              </div>
              <Link href="/methodology" className="text-sm font-medium text-[var(--accent)] hover:text-white">
                Read methodology
              </Link>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.title} className="rounded-xl border border-white/10 bg-white/[0.035] p-6">
                    <Icon className="text-[var(--accent)]" size={22} aria-hidden="true" />
                    <h3 className="mt-5 text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{feature.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
