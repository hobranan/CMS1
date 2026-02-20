import test from "node:test";
import assert from "node:assert/strict";
import { createUc03System } from "../helpers/uc03_system.js";
import { validLoginPayload } from "./fixtures/login_payloads.js";

test("successful login returns authenticated response and session id", () => {
  const system = createUc03System();
  system.addUser(validLoginPayload.email, validLoginPayload.password);
  const result = system.call("/api/v1/auth/login:POST", { body: validLoginPayload });
  assert.equal(result.status, 200);
  assert.equal(result.body.status, "AUTHENTICATED");
  assert.ok(result.body.session_id);
});

test("active session endpoint returns 200", () => {
  const system = createUc03System();
  system.addUser(validLoginPayload.email, validLoginPayload.password);
  const login = system.call("/api/v1/auth/login:POST", { body: validLoginPayload });
  const session = system.call("/api/v1/auth/session:GET", { sessionId: login.body.session_id });
  assert.equal(session.status, 200);
});
