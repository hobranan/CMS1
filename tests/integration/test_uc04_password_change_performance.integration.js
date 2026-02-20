import test from "node:test";
import assert from "node:assert/strict";
import { createUc04System } from "../helpers/uc04_system.js";
import { validPasswordChangePayload } from "../contract/fixtures/password_change_payloads.js";

test("password-change decision completes under 500ms in local harness", () => {
  const system = createUc04System();
  const email = "registered_user@example.com";
  system.addUser(email, validPasswordChangePayload.current_password);
  const login = system.login(email, validPasswordChangePayload.current_password);
  const start = Date.now();
  const result = system.call("/api/v1/account/password:PUT", {
    user: { email },
    sessionId: login.body.session_id,
    body: validPasswordChangePayload
  });
  const elapsed = Date.now() - start;
  assert.equal(result.status, 200);
  assert.ok(elapsed < 500);
});
