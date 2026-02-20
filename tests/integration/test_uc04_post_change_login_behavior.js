import test from "node:test";
import assert from "node:assert/strict";
import { createUc04System } from "../helpers/uc04_system.js";
import { validPasswordChangePayload } from "../contract/fixtures/password_change_payloads.js";

test("old password fails and new password succeeds after change", () => {
  const system = createUc04System();
  const email = "registered_user@example.com";
  system.addUser(email, validPasswordChangePayload.current_password);
  const login = system.login(email, validPasswordChangePayload.current_password);
  const changed = system.call("/api/v1/account/password:PUT", {
    user: { email },
    sessionId: login.body.session_id,
    body: validPasswordChangePayload
  });
  assert.equal(changed.status, 200);

  const oldLogin = system.login(email, validPasswordChangePayload.current_password);
  assert.equal(oldLogin.status, 401);
  const newLogin = system.login(email, validPasswordChangePayload.new_password);
  assert.equal(newLogin.status, 200);
});
