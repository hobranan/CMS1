import test from "node:test";
import assert from "node:assert/strict";
import { createUc19System } from "../../helpers/uc19_system.js";

test("public pricing latency p95 stays under target in local harness", () => {
  const system = createUc19System();
  system.seedPublishedPricing({ conferenceId: "c19-i7", categories: Array.from({ length: 20 }, (_, i) => ({ categoryId: `c${i}`, categoryName: `Cat ${i}`, finalAmountCad: 50 + i, complete: true })) });
  const samples = [];
  for (let i = 0; i < 30; i += 1) {
    const start = performance.now();
    const response = system.call("/api/v1/public/registration-prices:GET");
    assert.equal(response.status, 200);
    samples.push(performance.now() - start);
  }
  const sorted = [...samples].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95) - 1] ?? sorted[sorted.length - 1];
  assert.ok(p95 < 400, `expected p95 < 400ms, got ${p95}`);
});
