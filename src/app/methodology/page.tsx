import { MethodologySection } from "@/components/methodology-section";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

const checks = [
  "Public profile metadata and account dates",
  "Repository ownership: original repositories and forks",
  "README coverage for top updated repositories",
  "Descriptions, homepage/demo links, stars, forks, issues, archive state, and repository size",
  "Language depth from repository language endpoints when available",
  "Recent public events from GitHub REST API"
];

export default function MethodologyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-5 py-12 md:px-8">
        <div className="mx-auto max-w-5xl space-y-8">
          <section>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">Methodology</p>
            <h1 className="mt-4 text-4xl font-semibold text-white md:text-6xl">How the analysis works</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              The analyzer fetches public GitHub data, derives explicit evidence signals, and explains every label. The output is meant to guide manual review.
            </p>
          </section>
          <section className="rounded-2xl border border-white/10 bg-[#10131b]/80 p-6">
            <h2 className="text-2xl font-semibold text-white">What it checks</h2>
            <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-400">
              {checks.map((check) => (
                <li key={check} className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  <span>{check}</span>
                </li>
              ))}
            </ul>
          </section>
          <MethodologySection />
          <section className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-6">
            <h2 className="text-2xl font-semibold text-white">Limitations</h2>
            <p className="mt-3 text-sm leading-6 text-amber-50/80">
              GitHub public events are limited and may not represent full contribution history. Private work, company repositories, pair programming, code review, design decisions, and non-GitHub projects are outside the public API evidence.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
