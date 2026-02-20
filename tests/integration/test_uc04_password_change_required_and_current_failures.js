import test from "node:test";
import assert from "node:assert/strict";
import { createUc04System } from "../helpers/uc04_system.js";

test("missing fields and incorrect current password are rejected", () => {
  const system = createUc04System();
  const email = "registered_user@example.com";
  system.addUser(email, "OldSecurePass!123");

  const missing = system.call("/api/v1/account/password:PUT", {
    user: { email },
    sessionId: "s",
    body: { current_password: "", new_password: "", confirm_new_password: "" }
  });
  assert.equal(missing.status, 400);

  const wrongCurrent = system.call("/api/v1/account/password:PUT", {
    user: { email },
    sessionId: "s",
    body: { current_password: "Wrong!123", new_password: "NewSecurePass!456", confirm_new_password: "NewSecurePass!456" }
  });
  assert.equal(wrongCurrent.status, 400);
  assert.equal(wrongCurrent.body.code, "INCORRECT_CURRENT_PASSWORD");
});
