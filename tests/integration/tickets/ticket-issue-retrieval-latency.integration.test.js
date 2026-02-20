import test from "node:test";
import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import { createUc21System } from "../../helpers/uc21_system.js";

test("ticket issue and retrieval latency stays under p95 target", () => {
  const system = createUc21System();
  const user = system.addUser("uc21-latency@example.test");
  const samples = [];

  for (let i = 0; i < 20; i += 1) {
    const registrationId = `uc21-lat-${i}`;
    system.seedPaidRegistration(registrationId, user.id);
    const start = performance.now();
    system.call("/api/v1/registrations/:registrationId/ticket/issue:POST", {
      user,
      params: { registrationId }
    });
    system.call("/api/v1/account/registrations/:registrationId/ticket.pdf:GET", {
      user,
      params: { registrationId }
    });
    samples.push(performance.now() - start);
  }

  const sorted = samples.slice().sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95) - 1];
  assert.ok(p95 < 500, `expected p95 < 500ms, got ${p95.toFixed(2)}ms`);
});

