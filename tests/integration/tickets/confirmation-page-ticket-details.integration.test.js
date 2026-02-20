import test from "node:test";
import assert from "node:assert/strict";
import { createUc21System } from "../../helpers/uc21_system.js";

test("ticket confirmation payload includes reference and qr marker", () => {
  const system = createUc21System();
  const user = system.addUser("uc21-confirmation@example.test");
  const registrationId = "uc21-int-2";
  system.seedPaidRegistration(registrationId, user.id);

  const issue = system.call("/api/v1/registrations/:registrationId/ticket/issue:POST", {
    user,
    params: { registrationId }
  });
  assert.equal(issue.status, 200);
  assert.match(issue.body.ticketReference, /^TKT-/);
  assert.equal(issue.body.qrCodePresent, true);
});

