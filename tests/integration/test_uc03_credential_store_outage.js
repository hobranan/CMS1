import test from "node:test";
import assert from "node:assert/strict";
import { createUc03System } from "../helpers/uc03_system.js";
import { validLoginPayload } from "../contract/fixtures/login_payloads.js";

test("credential store outage denies authentication and allows retry later", () => {
  const system = createUc03System();
  system.addUser(validLoginPayload.email, validLoginPayload.password);
  system.deps.credentialStoreRepository.setUnavailable(true);
  const result = system.call("/api/v1/auth/login:POST", { body: validLoginPayload });
  assert.equal(result.status, 503);
  assert.equal(result.body.code, "SYSTEM_TEMPORARILY_UNAVAILABLE");
});
