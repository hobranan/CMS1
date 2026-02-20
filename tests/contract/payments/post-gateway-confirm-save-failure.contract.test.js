import test from "node:test";
import assert from "node:assert/strict";
import { createUc20System } from "../../helpers/uc20_system.js";

test("gateway success with db save failure returns reconciliation error", () => {
  const system = createUc20System();
  const user = system.addUser("attendee20-savefail@example.test");
  const registrationId = "reg-20-7";
  system.seedRegistration({ registrationId, attendeeId: user.id });
  const init = system.call("/api/v1/registrations/:registrationId/payment/initiate:POST", {
    user,
    params: { registrationId },
    body: { categoryId: "regular" }
  });
  system.failPaymentPersist();

  const response = system.call("/api/v1/payments/gateway/confirm:POST", {
    body: {
      attemptId: init.body.attemptId,
      gatewayStatus: "success",
      gatewayReference: "gw-ref-205",
      signature: "valid-signature"
    }
  });

  assert.equal(response.status, 500);
  assert.equal(response.body.code, "PAYMENT_RECONCILIATION_REQUIRED");
  assert.ok(response.body.reconciliationId);
});

