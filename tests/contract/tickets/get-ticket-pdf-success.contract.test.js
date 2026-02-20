import test from "node:test";
import assert from "node:assert/strict";
import { createUc21System } from "../../helpers/uc21_system.js";

test("ticket pdf retrieval returns application/pdf payload", () => {
  const system = createUc21System();
  const user = system.addUser("uc21-pdf@example.test");
  const registrationId = "uc21-reg-3";
  system.seedPaidRegistration(registrationId, user.id);
  system.call("/api/v1/registrations/:registrationId/ticket/issue:POST", {
    user,
    params: { registrationId }
  });

  const response = system.call("/api/v1/account/registrations/:registrationId/ticket.pdf:GET", {
    user,
    params: { registrationId }
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers["content-type"], "application/pdf");
  assert.match(response.body, /PDF-TICKET/);
});

