import test from "node:test";
import assert from "node:assert/strict";
import { createUc15System } from "../../helpers/uc15_system.js";

test("decision and notification retrieval p95 stays under 400ms in local harness", () => {
  const system = createUc15System();
  const author = system.addAuthor("a15-13@example.com");
  const editor = system.addEditor("e15-13@example.com");
  for (let i = 0; i < 25; i += 1) {
    const paperId = `p15-perf-${i}`;
    system.seedPaper({ paperId, editorId: editor.id, authors: [author.id], completedReviewCount: 1, reviewHighlights: ["Perf"], fullReviewContent: { text: "Perf review" } });
    system.recordDecision({ paperId, editorId: editor.id, outcome: "accept", comment: "Perf" });
  }

  const samples = [];
  for (let i = 0; i < 25; i += 1) {
    const paperId = `p15-perf-${i}`;
    const start = performance.now();
    const decision = system.call("/api/v1/author/papers/:paperId/decision:GET", { params: { paperId }, user: { id: author.id, email: author.email, role: "author" } });
    const notification = system.call("/api/v1/author/papers/:paperId/decision-notification:GET", { params: { paperId }, user: { id: author.id, email: author.email, role: "author" } });
    assert.equal(decision.status, 200);
    assert.equal(notification.status, 200);
    samples.push(performance.now() - start);
  }

  const sorted = [...samples].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95) - 1] ?? sorted[sorted.length - 1];
  assert.ok(p95 < 400, `expected p95 < 400ms, got ${p95}`);
});
