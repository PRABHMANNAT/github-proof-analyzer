import Link from "next/link";
import { GitBranch } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-5 py-10 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <p>Proof-first GitHub evidence analysis. Built without black-box talent scores.</p>
        <div className="flex flex-wrap items-center gap-5">
          <Link href="/methodology" className="hover:text-white">
            Methodology
          </Link>
          <Link href="/about" className="hover:text-white">
            About
          </Link>
          <Link
            href="https://github.com/PRABHMANNAT/github-proof-analyzer"
            className="inline-flex items-center gap-2 hover:text-white"
          >
            <GitBranch size={16} aria-hidden="true" />
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
