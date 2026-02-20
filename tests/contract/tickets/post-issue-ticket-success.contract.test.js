import test from "node:test";
import assert from "node:assert/strict";
import { createUc21System } from "../../helpers/uc21_system.js";

test("issue ticket succeeds for paid registration", () => {
  const system = createUc21System();
  const user = system.addUser("uc21-success@example.test");
  const registrationId = "uc21-reg-1";
  system.seedPaidRegistration(registrationId, user.id);

  const response = system.call("/api/v1/registrations/:registrationId/ticket/issue:POST", {
    user,
    params: { registrationId }
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.registrationState, "paid_confirmed");
  assert.equal(response.body.format, "pdf");
  assert.equal(response.body.qrCodePresent, true);
});

