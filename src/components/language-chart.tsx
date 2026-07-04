"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { LanguageSummary } from "@/lib/types";

type LanguageChartProps = {
  summary: LanguageSummary;
};

export function LanguageChart({ summary }: LanguageChartProps) {
  const data = summary.languages.slice(0, 8).map((language) => ({
    name: language.name,
    repositories: language.repositories,
    bytes: language.bytes
  }));

  return (
    <section className="rounded-2xl border border-white/10 bg-[#10131b]/80 p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h2 className="text-2xl font-semibold text-white">Language depth</h2>
          <p className="mt-2 text-sm text-slate-400">{summary.insight}</p>
        </div>
        <span className="w-fit rounded-full border border-[var(--accent)]/25 bg-[var(--accent)]/10 px-3 py-1 text-xs font-medium text-[var(--accent)]">
          {summary.consistency}
        </span>
      </div>
      <div className="mt-6 h-72">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: -20, right: 10 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="name" stroke="#8b9bb0" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#8b9bb0" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "#10131b", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8 }}
                itemStyle={{ color: "#f5f7fb" }}
              />
              <Bar dataKey="repositories" fill="#62e7c5" radius={[6, 6, 0, 0]} name="Repositories" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="grid h-full place-items-center rounded-xl border border-dashed border-white/10 text-sm text-slate-500">
            No public language data available.
          </div>
        )}
      </div>
    </section>
  );
}
