"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";

type UsernameSearchProps = {
  compact?: boolean;
  defaultValue?: string;
};

export function UsernameSearch({ compact = false, defaultValue = "" }: UsernameSearchProps) {
  const router = useRouter();
  const [username, setUsername] = useState(defaultValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = username.trim().replace(/^@/, "");
    router.push(normalized ? `/analyze?username=${encodeURIComponent(normalized)}` : "/demo");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-2 shadow-2xl shadow-black/20 sm:flex-row ${
        compact ? "max-w-2xl" : "max-w-3xl"
      }`}
    >
      <label className="sr-only" htmlFor="github-username">
        GitHub username
      </label>
      <div className="flex min-h-12 flex-1 items-center gap-3 rounded-lg bg-black/20 px-4">
        <Search size={18} className="shrink-0 text-slate-500" aria-hidden="true" />
        <input
          id="github-username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Enter a GitHub username"
          className="w-full bg-transparent text-base text-white outline-none placeholder:text-slate-500"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <button
        type="submit"
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-5 text-sm font-semibold text-slate-950 transition hover:bg-[var(--accent-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[#07080d]"
      >
        Analyze Profile
        <ArrowRight size={16} aria-hidden="true" />
      </button>
    </form>
  );
}
