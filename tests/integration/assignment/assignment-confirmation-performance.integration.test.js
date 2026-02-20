import test from "node:test";
import assert from "node:assert/strict";
import { createUc08System } from "../../helpers/uc08_system.js";

test("assignment confirmation p95 latency is below 500ms", () => {
  const system = createUc08System();
  system.addEditor("editor@example.com");
  const samples = [];

  for (let i = 0; i < 25; i += 1) {
    const paperId = `paper-perf-${i}`;
    system.seedPaper(paperId);
    system.seedReferee(`r${i}-1`);
    const start = Date.now();
    const result = system.call("/api/v1/papers/:paperId/assignments:POST", {
      params: { paperId },
      user: { email: "editor@example.com", role: "editor" },
      body: { referee_ids: [`r${i}-1`], expected_version: 0 }
    });
    const elapsed = Date.now() - start;
    assert.equal(result.status, 200);
    samples.push(elapsed);
  }

  const sorted = [...samples].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95) - 1];
  assert.ok(p95 < 500, `Expected p95 < 500ms, got ${p95}ms`);
});

