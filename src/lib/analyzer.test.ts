import { describe, expect, it } from "vitest";
import { analyzeProfileBundle, analyzeRepositories, calculateOriginalForkRatio, findStrongestRepos } from "@/lib/analyzer";
import { demoProfileBundle } from "@/lib/demo-data";
import { exportReportToMarkdown, generateRecruiterReport } from "@/lib/report";

describe("repository proof analysis", () => {
  it("calculates original vs fork ratio", () => {
    const ratio = calculateOriginalForkRatio(demoProfileBundle.repos);

    expect(ratio.original).toBe(5);
    expect(ratio.forked).toBe(1);
    expect(ratio.originalPercent).toBe(83);
  });

  it("labels evidence without talent judgments", () => {
    const evidence = analyzeRepositories(demoProfileBundle.repos, demoProfileBundle.readmeMap);
    const proofBoard = evidence.find((item) => item.repo.name === "proof-board");
    const legacy = evidence.find((item) => item.repo.name === "legacy-jquery-widget");

    expect(proofBoard?.label).toBe("Strong Evidence");
    expect(legacy?.label).toBe("Weak Evidence");
  });

  it("selects strongest repositories transparently", () => {
    const strongest = findStrongestRepos(demoProfileBundle.repos, demoProfileBundle.readmeMap);

    expect(strongest).toHaveLength(5);
    expect(strongest[0].repo.name).toBe("proof-board");
    expect(strongest[0].reasons).toContain("Original repository ownership signal");
  });
});

describe("recruiter report", () => {
  it("generates report sections and markdown export", () => {
    const analysis = analyzeProfileBundle(demoProfileBundle, true);
    const report = generateRecruiterReport(analysis);
    const markdown = exportReportToMarkdown(report);

    expect(report.summary).toContain("original repositories");
    expect(report.interviewQuestions.length).toBeGreaterThan(0);
    expect(markdown).toContain("## Ethical Note");
    expect(markdown).not.toMatch(/bad developer/i);
    expect(markdown).toContain("not as a talent score");
  });
});
