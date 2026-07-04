"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { AnalysisResult } from "@/lib/types";

type ForkRatioChartProps = {
  ratio: AnalysisResult["originalForkRatio"];
};

const COLORS = ["#62e7c5", "#8b9bb0"];

export function ForkRatioChart({ ratio }: ForkRatioChartProps) {
  const data = [
    { name: "Original", value: ratio.original },
    { name: "Forked", value: ratio.forked }
  ];

  return (
    <section className="rounded-2xl border border-white/10 bg-[#10131b]/80 p-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-white">Original vs forked ratio</h2>
        <p className="text-sm text-slate-400">{ratio.interpretation}</p>
      </div>
      <div className="mt-5 grid gap-6 md:grid-cols-[16rem_1fr] md:items-center">
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={62} outerRadius={92} paddingAngle={4}>
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#10131b", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8 }}
                itemStyle={{ color: "#f5f7fb" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <RatioStat label="Original repos" value={ratio.original} percent={ratio.originalPercent} />
          <RatioStat label="Forked repos" value={ratio.forked} percent={ratio.forkedPercent} />
        </div>
      </div>
    </section>
  );
}

function RatioStat({ label, value, percent }: { label: string; value: number; percent: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{percent}% of public repositories</p>
    </div>
  );
}
