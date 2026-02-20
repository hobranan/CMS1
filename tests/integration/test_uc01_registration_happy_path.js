import test from "node:test";
import assert from "node:assert/strict";
import { createUc01System } from "../helpers/uc01_system.js";
import { validRegistrationPayload } from "../contract/fixtures/registration_payloads.js";

test("happy path: register -> verify -> login", () => {
  const system = createUc01System();
  const register = system.call("/api/v1/registrations:POST", { body: validRegistrationPayload });
  assert.equal(register.status, 202);

  const token = system.verificationEmailService.outbox[0].token;
  const verify = system.call("/api/v1/registrations/verify:GET", { query: { token } });
  assert.equal(verify.status, 200);

  const login = system.call("/api/v1/auth/login:POST", {
    body: { email: validRegistrationPayload.email, password: validRegistrationPayload.password }
  });
  assert.equal(login.status, 200);
  assert.equal(login.body.status, "AUTHENTICATED");
});
