import test from "node:test";
import assert from "node:assert/strict";
import { createUc04System } from "../helpers/uc04_system.js";
import { validPasswordChangePayload } from "../contract/fixtures/password_change_payloads.js";

test("session is invalidated immediately after successful password change", () => {
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

  const sessionState = system.call("/api/v1/auth/session:GET", { sessionId: login.body.session_id });
  assert.equal(sessionState.status, 401);
});
