"use client";

import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";

type MarkdownExportButtonProps = {
  markdown: string;
  filename: string;
};

export function MarkdownExportButton({ markdown, filename }: MarkdownExportButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyMarkdown() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function downloadMarkdown() {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={copyMarkdown}
        className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-[var(--accent-strong)]"
      >
        {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        {copied ? "Copied" : "Copy Markdown"}
      </button>
      <button
        type="button"
        onClick={downloadMarkdown}
        className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/25"
      >
        <Download size={16} aria-hidden="true" />
        Export .md
      </button>
    </div>
  );
}
