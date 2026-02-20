import test from "node:test";
import assert from "node:assert/strict";
import { createUc03System } from "../helpers/uc03_system.js";
import { validLoginPayload } from "../contract/fixtures/login_payloads.js";

test("protected page refresh succeeds while session is active", () => {
  const system = createUc03System();
  system.addUser(validLoginPayload.email, validLoginPayload.password);
  const login = system.call("/api/v1/auth/login:POST", { body: validLoginPayload });
  const result = system.call("/api/v1/auth/session:GET", { sessionId: login.body.session_id });
  assert.equal(result.status, 200);
});
