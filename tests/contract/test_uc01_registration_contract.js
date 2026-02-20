import test from "node:test";
import assert from "node:assert/strict";
import { createUc01System } from "../helpers/uc01_system.js";
import { validRegistrationPayload } from "./fixtures/registration_payloads.js";

test("POST /registrations returns 202 for valid request", () => {
  const system = createUc01System();
  const result = system.call("/api/v1/registrations:POST", { body: validRegistrationPayload });
  assert.equal(result.status, 202);
  assert.equal(result.body.status, "PENDING_VERIFICATION");
});

test("POST /registrations returns 422 for validation failures", () => {
  const system = createUc01System();
  const result = system.call("/api/v1/registrations:POST", {
    body: { email: "bad", password: "short", confirmPassword: "different" }
  });
  assert.equal(result.status, 422);
  assert.equal(result.body.code, "VALIDATION_FAILED");
  assert.ok(result.body.errors.length >= 3);
});

test("GET /registrations/verify returns 400 when token missing", () => {
  const system = createUc01System();
  const result = system.call("/api/v1/registrations/verify:GET", { query: {} });
  assert.equal(result.status, 400);
  assert.equal(result.body.code, "TOKEN_MISSING");
});

test("POST /auth/login returns 403 for unverified user", () => {
  const system = createUc01System();
  system.call("/api/v1/registrations:POST", { body: validRegistrationPayload });
  const result = system.call("/api/v1/auth/login:POST", {
    body: { email: validRegistrationPayload.email, password: validRegistrationPayload.password }
  });
  assert.equal(result.status, 403);
  assert.equal(result.body.code, "EMAIL_UNVERIFIED");
});
