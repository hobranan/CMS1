import test from "node:test";
import assert from "node:assert/strict";
import { createUc09System } from "../../helpers/uc09_system.js";

test("workload decision p95 latency is below 300ms", () => {
  const system = createUc09System();
  system.addEditor("editor@example.com");
  system.deps.workloadLimitRuleRepository.setConferenceDefault(5, 1);

  const samples = [];
  for (let i = 0; i < 30; i += 1) {
    const refereeId = `perf-r-${i}`;
    system.deps.refereeWorkloadRetrievalService.seed(refereeId, 0);
    const start = Date.now();
    const result = system.call("/api/v1/papers/:paperId/assign-referee:POST", {
      params: { paperId: `paper-perf-${i}` },
      user: { email: "editor@example.com", role: "editor" },
      body: { referee_id: refereeId }
    });
    const elapsed = Date.now() - start;
    assert.equal(result.status, 200);
    samples.push(elapsed);
  }

  const sorted = [...samples].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95) - 1];
  assert.ok(p95 < 300, `Expected p95 < 300ms, got ${p95}ms`);
});

