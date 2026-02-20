import test from "node:test";
import assert from "node:assert/strict";
import { createUc01System } from "../helpers/uc01_system.js";
import { validRegistrationPayload } from "../contract/fixtures/registration_payloads.js";
import { hashToken } from "../../backend/src/services/security/verification_token_service.js";

test("tokens are stored hashed and enforced single-use", () => {
  const system = createUc01System();
  system.call("/api/v1/registrations:POST", { body: validRegistrationPayload });
  const raw = system.verificationEmailService.outbox[0].token;
  const hashed = hashToken(raw);
  const tokenRecord = system.repository.getTokenByHash(hashed);
  assert.ok(tokenRecord);
  assert.notEqual(tokenRecord.tokenHash, raw);

  const first = system.call("/api/v1/registrations/verify:GET", { query: { token: raw } });
  assert.equal(first.status, 200);
  const second = system.call("/api/v1/registrations/verify:GET", { query: { token: raw } });
  assert.equal(second.status, 410);
});
