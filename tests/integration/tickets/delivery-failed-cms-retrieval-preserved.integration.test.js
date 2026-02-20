import test from "node:test";
import assert from "node:assert/strict";
import { createUc21System } from "../../helpers/uc21_system.js";

test("delivery failure still preserves cms ticket retrieval", () => {
  const system = createUc21System();
  const user = system.addUser("uc21-deliveryfail@example.test");
  const registrationId = "uc21-int-6";
  system.seedPaidRegistration(registrationId, user.id);
  system.forceDeliveryFailure();

  const issue = system.call("/api/v1/registrations/:registrationId/ticket/issue:POST", {
    user,
    params: { registrationId }
  });
  assert.equal(issue.body.deliveryStatus, "failed");

  const pdf = system.call("/api/v1/account/registrations/:registrationId/ticket.pdf:GET", {
    user,
    params: { registrationId }
  });
  assert.equal(pdf.status, 200);
});

