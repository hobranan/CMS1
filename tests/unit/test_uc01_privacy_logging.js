import test from "node:test";
import assert from "node:assert/strict";
import { RegistrationAuditLog } from "../../backend/src/services/registration/registration_audit_log.js";

test("audit log masks emails and omits secrets", () => {
  const log = new RegistrationAuditLog();
  log.record("registration_submitted", {
    email: "person@example.com",
    password: "StrongPass!123",
    token: "raw-token"
  });
  const entry = log.events[0];
  assert.equal(entry.payload.email, "p***@example.com");
  assert.equal("password" in entry.payload, false);
  assert.equal("token" in entry.payload, false);
});
