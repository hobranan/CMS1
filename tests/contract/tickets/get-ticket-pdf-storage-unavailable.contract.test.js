import test from "node:test";
import assert from "node:assert/strict";
import { createUc21System } from "../../helpers/uc21_system.js";

test("pdf endpoint returns 503 with stable code/message when storage unavailable", () => {
  const system = createUc21System();
  const user = system.addUser("uc21-storageunavail@example.test");
  const registrationId = "uc21-reg-6";
  system.seedPaidRegistration(registrationId, user.id);
  system.call("/api/v1/registrations/:registrationId/ticket/issue:POST", {
    user,
    params: { registrationId }
  });
  system.failPdfRead();

  const response = system.call("/api/v1/account/registrations/:registrationId/ticket.pdf:GET", {
    user,
    params: { registrationId }
  });

  assert.equal(response.status, 503);
  assert.equal(response.body.code, "TICKET_STORAGE_UNAVAILABLE");
  assert.match(response.body.message, /temporarily unavailable/i);
});

