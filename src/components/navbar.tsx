import Link from "next/link";
import { GitBranch, ShieldCheck } from "lucide-react";

const navItems = [
  { href: "/analyze", label: "Analyze" },
  { href: "/demo", label: "Demo" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07080d]/86 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="GitHub Proof Analyzer home">
          <span className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-[var(--accent)]">
            <ShieldCheck size={18} aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold text-white">GitHub Proof Analyzer</span>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-slate-300 transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </div>
        <Link
          href="https://github.com/PRABHMANNAT/github-proof-analyzer"
          className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-white/20 hover:text-white"
          aria-label="View project on GitHub"
        >
          <GitBranch size={18} aria-hidden="true" />
        </Link>
      </nav>
    </header>
  );
}
