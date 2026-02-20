import test from "node:test";
import assert from "node:assert/strict";
import { createUc04System } from "../helpers/uc04_system.js";

test("policy failures include weak/current-equals-new/history-reuse/mismatch", () => {
  const system = createUc04System();
  const email = "registered_user@example.com";
  const current = "OldSecurePass!123";
  system.addUser(email, current);

  const weak = system.call("/api/v1/account/password:PUT", {
    user: { email },
    sessionId: "s",
    body: { current_password: current, new_password: "weak", confirm_new_password: "weak" }
  });
  assert.equal(weak.status, 400);
  assert.equal(weak.body.code, "PASSWORD_POLICY_VIOLATION");

  const equalsCurrent = system.call("/api/v1/account/password:PUT", {
    user: { email },
    sessionId: "s",
    body: { current_password: current, new_password: current, confirm_new_password: current }
  });
  assert.equal(equalsCurrent.status, 400);

  const mismatch = system.call("/api/v1/account/password:PUT", {
    user: { email },
    sessionId: "s",
    body: { current_password: current, new_password: "NewSecurePass!456", confirm_new_password: "Different!456" }
  });
  assert.equal(mismatch.status, 400);
  assert.equal(mismatch.body.code, "CONFIRMATION_MISMATCH");

  const login = system.login(email, current);
  const firstChange = system.call("/api/v1/account/password:PUT", {
    user: { email },
    sessionId: login.body.session_id,
    body: { current_password: current, new_password: "NewSecurePass!456", confirm_new_password: "NewSecurePass!456" }
  });
  assert.equal(firstChange.status, 200);

  const reuse = system.call("/api/v1/account/password:PUT", {
    user: { email },
    sessionId: "s2",
    body: { current_password: "NewSecurePass!456", new_password: current, confirm_new_password: current }
  });
  assert.equal(reuse.status, 400);
  assert.equal(reuse.body.code, "PASSWORD_POLICY_VIOLATION");
});
