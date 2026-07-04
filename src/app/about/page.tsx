import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen px-5 py-12 md:px-8">
        <section className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">About</p>
          <h1 className="mt-4 text-4xl font-semibold text-white md:text-6xl">Proof-first hiring, without unfair talent scores.</h1>
          <div className="mt-8 space-y-6 text-lg leading-8 text-slate-300">
            <p>
              GitHub Proof Analyzer helps organize visible public GitHub activity into evidence that recruiters and hiring teams can inspect. It is designed to support better conversations, not automate judgment.
            </p>
            <p>
              Public GitHub data is incomplete by nature. Many strong developers work in private repositories, company systems, school environments, or non-GitHub platforms. This product highlights that limitation instead of hiding it.
            </p>
            <p>
              The app uses neutral labels such as strong public evidence, limited public evidence, and needs manual review. It never labels a person as a good or bad developer.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
