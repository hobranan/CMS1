import test from "node:test";
import assert from "node:assert/strict";
import { createUc20System } from "../../helpers/uc20_system.js";

test("gateway timeout confirmation returns unresolved pending outcome", () => {
  const system = createUc20System();
  const user = system.addUser("attendee20-timeout@example.test");
  const registrationId = "reg-20-6";
  system.seedRegistration({ registrationId, attendeeId: user.id });
  const init = system.call("/api/v1/registrations/:registrationId/payment/initiate:POST", {
    user,
    params: { registrationId },
    body: { categoryId: "regular" }
  });

  const response = system.call("/api/v1/payments/gateway/confirm:POST", {
    body: {
      attemptId: init.body.attemptId,
      gatewayStatus: "timeout",
      gatewayReference: "gw-ref-204",
      signature: "valid-signature"
    }
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.outcome, "pending_unresolved");
  assert.equal(response.body.registrationState, "pending");
  assert.ok(response.body.reconciliationId);
});

