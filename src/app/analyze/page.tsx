import { Suspense } from "react";
import { AnalyzeWorkspace } from "@/components/analyze-workspace";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function AnalyzePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-5 py-8 md:px-8">
        <Suspense fallback={<div className="mx-auto max-w-7xl text-slate-400">Preparing analyzer...</div>}>
          <AnalyzeWorkspace />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
