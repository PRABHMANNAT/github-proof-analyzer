"use client";

import Link from "next/link";
import { RotateCcw, Trash2 } from "lucide-react";

type RecentSearchesProps = {
  searches: string[];
  onClear: () => void;
};

export function RecentSearches({ searches, onClear }: RecentSearchesProps) {
  if (searches.length === 0) return null;

  return (
    <section className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-white">
          <RotateCcw size={15} aria-hidden="true" />
          Recent searches
        </h2>
        <button type="button" onClick={onClear} className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white">
          <Trash2 size={14} aria-hidden="true" />
          Clear
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {searches.map((search) => (
          <Link
            key={search}
            href={`/analyze?username=${encodeURIComponent(search)}`}
            className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:border-[var(--accent)]/35 hover:text-white"
          >
            @{search}
          </Link>
        ))}
      </div>
    </section>
  );
}
