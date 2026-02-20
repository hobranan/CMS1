import test from "node:test";
import assert from "node:assert/strict";
import { createUc01System } from "../helpers/uc01_system.js";

test("returns all validation errors in stable order", () => {
  const system = createUc01System();
  const result = system.call("/api/v1/registrations:POST", {
    body: { email: "bad", password: "short", confirmPassword: "wrong" }
  });
  assert.equal(result.status, 422);
  assert.deepEqual(
    result.body.errors.map((e) => e.code).slice(0, 4),
    [
      "INVALID_EMAIL_FORMAT",
      "PASSWORD_TOO_SHORT",
      "PASSWORD_MISSING_UPPERCASE",
      "PASSWORD_MISSING_NUMBER"
    ]
  );
});

test("blocks duplicate email", () => {
  const system = createUc01System();
  const payload = {
    email: "dup@example.com",
    password: "StrongPass!123",
    confirmPassword: "StrongPass!123"
  };
  const first = system.call("/api/v1/registrations:POST", { body: payload });
  assert.equal(first.status, 202);
  const second = system.call("/api/v1/registrations:POST", { body: payload });
  assert.equal(second.status, 422);
  assert.ok(second.body.errors.some((e) => e.code === "EMAIL_PENDING_REGISTRATION"));
});
