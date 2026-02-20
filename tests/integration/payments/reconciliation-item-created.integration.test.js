import test from "node:test";
import assert from "node:assert/strict";
import { createUc20System } from "../../helpers/uc20_system.js";

test("save failure after gateway success creates reconciliation item", () => {
  const system = createUc20System();
  const user = system.addUser("uc20-recon@example.test");
  const registrationId = "uc20-reg-4";
  system.seedRegistration({ registrationId, attendeeId: user.id });
  const initiate = system.call("/api/v1/registrations/:registrationId/payment/initiate:POST", {
    user,
    params: { registrationId },
    body: { categoryId: "regular" }
  });
  system.failPaymentPersist();

  const response = system.call("/api/v1/payments/gateway/confirm:POST", {
    body: {
      attemptId: initiate.body.attemptId,
      gatewayStatus: "success",
      gatewayReference: "gw-recon",
      signature: "valid-signature"
    }
  });

  assert.equal(response.status, 500);
  const items = system.getReconciliationItems();
  assert.equal(items.length, 1);
  assert.equal(items[0].reason, "gateway_success_persist_failed");
});

