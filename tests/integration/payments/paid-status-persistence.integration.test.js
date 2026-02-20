import test from "node:test";
import assert from "node:assert/strict";
import { createUc20System } from "../../helpers/uc20_system.js";

test("paid status persists across refresh and relogin style reads", () => {
  const system = createUc20System();
  const user = system.addUser("uc20-persist@example.test");
  const registrationId = "uc20-reg-2";
  system.seedRegistration({ registrationId, attendeeId: user.id });
  const initiate = system.call("/api/v1/registrations/:registrationId/payment/initiate:POST", {
    user,
    params: { registrationId },
    body: { categoryId: "regular" }
  });
  system.call("/api/v1/payments/gateway/confirm:POST", {
    body: {
      attemptId: initiate.body.attemptId,
      gatewayStatus: "success",
      gatewayReference: "gw-ok-2",
      signature: "valid-signature"
    }
  });

  const refreshRead = system.call("/api/v1/registrations/:registrationId/payment/status:GET", {
    user,
    params: { registrationId }
  });
  const reloginRead = system.call("/api/v1/registrations/:registrationId/payment/status:GET", {
    user: { id: user.id },
    params: { registrationId }
  });

  assert.equal(refreshRead.body.registrationState, "paid_confirmed");
  assert.equal(reloginRead.body.registrationState, "paid_confirmed");
  assert.equal(refreshRead.body.paymentId, reloginRead.body.paymentId);
});

