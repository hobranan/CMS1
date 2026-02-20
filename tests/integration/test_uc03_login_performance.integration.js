import test from "node:test";
import assert from "node:assert/strict";
import { createUc03System } from "../helpers/uc03_system.js";
import { validLoginPayload } from "../contract/fixtures/login_payloads.js";

test("login decision completes under 400ms in local test harness", () => {
  const system = createUc03System();
  system.addUser(validLoginPayload.email, validLoginPayload.password);
  const start = Date.now();
  const result = system.call("/api/v1/auth/login:POST", { body: validLoginPayload });
  const elapsed = Date.now() - start;
  assert.equal(result.status, 200);
  assert.ok(elapsed < 400);
});
