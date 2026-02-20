import test from "node:test";
import assert from "node:assert/strict";
import { hashPassword, validatePassword, verifyPassword } from "../../backend/src/services/security/password_service.js";

test("password hash/verify works", () => {
  const hash = hashPassword("StrongPass!123");
  assert.equal(verifyPassword("StrongPass!123", hash), true);
  assert.equal(verifyPassword("WrongPass!123", hash), false);
});

test("password policy catches weak passwords", () => {
  const errors = validatePassword("weak");
  assert.ok(errors.length > 0);
  assert.ok(errors.some((e) => e.code === "PASSWORD_TOO_SHORT"));
});
