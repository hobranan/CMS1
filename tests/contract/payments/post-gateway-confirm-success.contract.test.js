import test from "node:test";
import assert from "node:assert/strict";
import { createUc20System } from "../../helpers/uc20_system.js";

test("gateway success confirmation returns confirmed outcome", () => {
  const system = createUc20System();
  const user = system.addUser("attendee20-success@example.test");
  const registrationId = "reg-20-2";
  system.seedRegistration({ registrationId, attendeeId: user.id });
  const init = system.call("/api/v1/registrations/:registrationId/payment/initiate:POST", {
    user,
    params: { registrationId },
    body: { categoryId: "student" }
  });

  const response = system.call("/api/v1/payments/gateway/confirm:POST", {
    body: {
      attemptId: init.body.attemptId,
      gatewayStatus: "success",
      gatewayReference: "gw-ref-200",
      signature: "valid-signature"
    }
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.outcome, "confirmed");
  assert.equal(response.body.registrationState, "paid_confirmed");
});

