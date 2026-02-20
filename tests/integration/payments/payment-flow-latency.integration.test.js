import test from "node:test";
import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import { createUc20System } from "../../helpers/uc20_system.js";

test("payment flow latency stays below p95 target in local harness", () => {
  const system = createUc20System();
  const user = system.addUser("uc20-latency@example.test");
  const samples = [];

  for (let i = 0; i < 20; i += 1) {
    const registrationId = `uc20-reg-lat-${i}`;
    system.seedRegistration({ registrationId, attendeeId: user.id });
    const start = performance.now();
    const initiate = system.call("/api/v1/registrations/:registrationId/payment/initiate:POST", {
      user,
      params: { registrationId },
      body: { categoryId: "regular" }
    });
    system.call("/api/v1/payments/gateway/confirm:POST", {
      body: {
        attemptId: initiate.body.attemptId,
        gatewayStatus: "success",
        gatewayReference: `gw-lat-${i}`,
        signature: "valid-signature"
      }
    });
    samples.push(performance.now() - start);
  }

  const sorted = samples.slice().sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95) - 1];
  assert.ok(p95 < 500, `expected p95 < 500ms, got ${p95.toFixed(2)}ms`);
});

