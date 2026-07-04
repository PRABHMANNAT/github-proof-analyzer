"use client";

import { Activity, AlertCircle } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatGitHubDate } from "@/lib/analyzer";
import type { ActivityEvent } from "@/lib/types";

type ActivityTimelineProps = {
  activity: ActivityEvent[];
  activityByDate: Array<{ date: string; count: number }>;
  limitationNote: string;
};

export function ActivityTimeline({ activity, activityByDate, limitationNote }: ActivityTimelineProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#10131b]/80 p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h2 className="text-2xl font-semibold text-white">Commit / activity timeline</h2>
          <p className="mt-2 text-sm text-slate-400">
            Recent public events from GitHub REST API. This is a limited public feed, not full contribution history.
          </p>
        </div>
        <div className="inline-flex max-w-md items-start gap-2 rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-xs leading-5 text-amber-100">
          <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          {limitationNote}
        </div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="h-64 rounded-xl border border-white/10 bg-white/[0.025] p-4">
          {activityByDate.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityByDate.toReversed()} margin={{ left: -24, right: 4 }}>
                <XAxis dataKey="date" stroke="#8b9bb0" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#8b9bb0" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "#10131b", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8 }}
                  itemStyle={{ color: "#f5f7fb" }}
                />
                <Bar dataKey="count" fill="#62e7c5" radius={[5, 5, 0, 0]} name="Events" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid h-full place-items-center text-sm text-slate-500">No recent public activity events returned.</div>
          )}
        </div>
        <div className="max-h-80 overflow-auto pr-2">
          {activity.length > 0 ? (
            <ol className="space-y-3">
              {activity.slice(0, 12).map((event) => (
                <li key={event.id} className="grid grid-cols-[2rem_1fr] gap-3">
                  <span className="mt-1 grid size-8 place-items-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
                    <Activity size={15} aria-hidden="true" />
                  </span>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex flex-col justify-between gap-1 sm:flex-row">
                      <p className="font-medium text-white">{event.description}</p>
                      <time className="text-xs text-slate-500">{formatGitHubDate(event.createdAt)}</time>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">{event.repoName}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-600">{event.type.replace("Event", "")}</p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 p-6 text-sm text-slate-500">
              No public activity events were returned. This can happen for quiet profiles, private work, API limitations, or rate limits.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
