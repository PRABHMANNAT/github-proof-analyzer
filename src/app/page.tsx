export default function Home() {
  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          GitHub Proof Analyzer
        </p>
        <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight text-white md:text-7xl">
          Turn public GitHub activity into transparent proof signals.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
          A proof-first portfolio analyzer for recruiter-friendly evidence,
          repository context, and manual review guidance.
        </p>
      </section>
    </main>
  );
}
