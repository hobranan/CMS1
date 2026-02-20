import test from "node:test";
import assert from "node:assert/strict";
import { createUc04System } from "../helpers/uc04_system.js";

test("required fields and mismatch return 400", () => {
  const system = createUc04System();
  system.addUser("registered_user@example.com", "OldSecurePass!123");
  const required = system.call("/api/v1/account/password:PUT", {
    user: { email: "registered_user@example.com" },
    sessionId: "missing",
    body: { current_password: "", new_password: "", confirm_new_password: "" }
  });
  assert.equal(required.status, 400);

  const mismatch = system.call("/api/v1/account/password:PUT", {
    user: { email: "registered_user@example.com" },
    sessionId: "missing",
    body: { current_password: "OldSecurePass!123", new_password: "NewSecurePass!456", confirm_new_password: "Different!456" }
  });
  assert.equal(mismatch.status, 400);
  assert.equal(mismatch.body.code, "CONFIRMATION_MISMATCH");
});
