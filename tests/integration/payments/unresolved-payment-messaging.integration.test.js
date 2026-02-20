import test from "node:test";
import assert from "node:assert/strict";
import { createUc20System } from "../../helpers/uc20_system.js";

test("timeout unresolved flow sets pending state with unresolved message", () => {
  const system = createUc20System();
  const user = system.addUser("uc20-unresolved@example.test");
  const registrationId = "uc20-reg-3";
  system.seedRegistration({ registrationId, attendeeId: user.id });
  const initiate = system.call("/api/v1/registrations/:registrationId/payment/initiate:POST", {
    user,
    params: { registrationId },
    body: { categoryId: "regular" }
  });
  system.call("/api/v1/payments/gateway/confirm:POST", {
    body: {
      attemptId: initiate.body.attemptId,
      gatewayStatus: "timeout",
      gatewayReference: "gw-timeout",
      signature: "valid-signature"
    }
  });

  const status = system.call("/api/v1/registrations/:registrationId/payment/status:GET", {
    user,
    params: { registrationId }
  });
  assert.equal(status.body.registrationState, "pending");
  assert.match(status.body.message, /unresolved/i);
});

