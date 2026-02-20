import test from "node:test";
import assert from "node:assert/strict";
import { createUc13System } from "../../helpers/uc13_system.js";

test("completed-review access stays within p95 target window for in-memory path", () => {
  const system = createUc13System();
  const editor = system.addEditor("perf1@example.com");
  const referee = system.addReferee("perfr@example.com");
  for (let i = 0; i < 25; i += 1) {
    const assignmentId = `p${i}`;
    system.seedAssignment({ assignmentId, paperId: "perf-paper", editorId: editor.id, refereeId: referee.id, status: "completed" });
    system.seedSubmittedReview({ assignmentId, refereeId: referee.id, fields: { score: "A" }, recommendation: "accept", comments: "ok", now: new Date("2026-02-20T10:00:00.000Z") });
  }

  const samples = [];
  for (let i = 0; i < 25; i += 1) {
    const start = performance.now();
    const response = system.call("/api/v1/papers/:paperId/completed-reviews:GET", { params: { paperId: "perf-paper" }, user: { id: editor.id, email: editor.email, role: "editor" } });
    assert.equal(response.status, 200);
    samples.push(performance.now() - start);
  }
  const sorted = [...samples].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95) - 1] ?? sorted[sorted.length - 1];
  assert.ok(p95 < 300, `expected p95 < 300ms, got ${p95}`);
});
