const evidenceRules = [
  ["Original repo", "+3"],
  ["README present", "+2"],
  ["Description present", "+1"],
  ["Updated within 90 days", "+3"],
  ["Updated within 180 days", "+2"],
  ["Stars or forks present", "+1 each"],
  ["Homepage/demo link", "+2"],
  ["Meaningful repository size", "+1"],
  ["Archived repository", "-2"],
  ["Forked repository", "-1"],
  ["Missing README or description", "-1 each"],
  ["Very old update", "-2"]
];

export function MethodologySection() {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#10131b]/80 p-6">
      <h2 className="text-2xl font-semibold text-white">Transparent repository evidence heuristic</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
        Each repository receives evidence points to produce a review label. The label describes public evidence strength only; it does not rate talent, intelligence, or hireability.
      </p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.16em] text-slate-500">
            <tr>
              <th className="border-b border-white/10 py-3 font-medium">Signal</th>
              <th className="border-b border-white/10 py-3 font-medium">Effect</th>
            </tr>
          </thead>
          <tbody>
            {evidenceRules.map(([signal, effect]) => (
              <tr key={signal} className="border-b border-white/10 last:border-0">
                <td className="py-3 text-slate-300">{signal}</td>
                <td className="py-3 font-medium text-white">{effect}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {["9+ Strong Evidence", "5-8 Moderate Evidence", "1-4 Weak Evidence", "0 or less Needs Manual Review"].map((label) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}
