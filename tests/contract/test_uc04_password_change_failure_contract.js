import test from "node:test";
import assert from "node:assert/strict";
import { createUc04System } from "../helpers/uc04_system.js";
import { validPasswordChangePayload } from "./fixtures/password_change_payloads.js";

test("system failure returns retry-later response", () => {
  const system = createUc04System();
  system.addUser("registered_user@example.com", validPasswordChangePayload.current_password);
  const login = system.login("registered_user@example.com", validPasswordChangePayload.current_password);
  system.deps.credentialRepository.failNextUpdate = true;

  const result = system.call("/api/v1/account/password:PUT", {
    user: { email: "registered_user@example.com" },
    sessionId: login.body.session_id,
    body: validPasswordChangePayload
  });
  assert.equal(result.status, 503);
});
