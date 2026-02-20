import test from "node:test";
import assert from "node:assert/strict";
import { createUc01System } from "../helpers/uc01_system.js";
import { validRegistrationPayload } from "../contract/fixtures/registration_payloads.js";

test("expired verification token returns 410 and resend works", () => {
  const system = createUc01System();
  system.call("/api/v1/registrations:POST", { body: validRegistrationPayload });
  const token = system.verificationEmailService.outbox[0].token;

  system.advanceMs(24 * 60 * 60 * 1000);
  const verify = system.call("/api/v1/registrations/verify:GET", { query: { token } });
  assert.equal(verify.status, 410);
  assert.equal(verify.body.code, "TOKEN_EXPIRED");

  system.advanceMs(61 * 1000);
  const resend = system.call("/api/v1/registrations/resend-confirmation:POST", {
    body: { email: validRegistrationPayload.email }
  });
  assert.equal(resend.status, 202);
});

test("pre-verification login is denied; expired pending cannot login/resend", () => {
  const system = createUc01System();
  system.call("/api/v1/registrations:POST", { body: validRegistrationPayload });
  const denied = system.call("/api/v1/auth/login:POST", {
    body: { email: validRegistrationPayload.email, password: validRegistrationPayload.password }
  });
  assert.equal(denied.status, 403);
  assert.equal(denied.body.code, "EMAIL_UNVERIFIED");

  system.advanceMs(7 * 24 * 60 * 60 * 1000);
  const expiredLogin = system.call("/api/v1/auth/login:POST", {
    body: { email: validRegistrationPayload.email, password: validRegistrationPayload.password }
  });
  assert.equal(expiredLogin.status, 403);
  assert.equal(expiredLogin.body.code, "REGISTRATION_ATTEMPT_EXPIRED");

  const expiredResend = system.call("/api/v1/registrations/resend-confirmation:POST", {
    body: { email: validRegistrationPayload.email }
  });
  assert.equal(expiredResend.status, 410);
});
