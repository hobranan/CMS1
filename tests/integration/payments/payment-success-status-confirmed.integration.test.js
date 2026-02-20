import test from "node:test";
import assert from "node:assert/strict";
import { createUc20System } from "../../helpers/uc20_system.js";

test("successful payment records paid_confirmed status", () => {
  const system = createUc20System();
  const user = system.addUser("uc20-success@example.test");
  const registrationId = "uc20-reg-1";
  system.seedRegistration({ registrationId, attendeeId: user.id });
  const initiate = system.call("/api/v1/registrations/:registrationId/payment/initiate:POST", {
    user,
    params: { registrationId },
    body: { categoryId: "standard" }
  });

  system.call("/api/v1/payments/gateway/confirm:POST", {
    body: {
      attemptId: initiate.body.attemptId,
      gatewayStatus: "success",
      gatewayReference: "gw-ok-1",
      signature: "valid-signature"
    }
  });

  const status = system.call("/api/v1/registrations/:registrationId/payment/status:GET", {
    user,
    params: { registrationId }
  });
  assert.equal(status.status, 200);
  assert.equal(status.body.registrationState, "paid_confirmed");
  assert.ok(status.body.paymentId);
});

