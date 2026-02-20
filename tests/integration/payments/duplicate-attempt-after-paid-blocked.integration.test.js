import test from "node:test";
import assert from "node:assert/strict";
import { createUc20System } from "../../helpers/uc20_system.js";

test("duplicate attempt after paid is blocked with 409 payload", () => {
  const system = createUc20System();
  const user = system.addUser("uc20-dup@example.test");
  const registrationId = "uc20-reg-5";
  system.seedRegistration({ registrationId, attendeeId: user.id });
  const first = system.call("/api/v1/registrations/:registrationId/payment/initiate:POST", {
    user,
    params: { registrationId },
    body: { categoryId: "regular" }
  });
  system.call("/api/v1/payments/gateway/confirm:POST", {
    body: {
      attemptId: first.body.attemptId,
      gatewayStatus: "success",
      gatewayReference: "gw-paid",
      signature: "valid-signature"
    }
  });

  const duplicate = system.call("/api/v1/registrations/:registrationId/payment/initiate:POST", {
    user,
    params: { registrationId },
    body: { categoryId: "regular" }
  });
  assert.equal(duplicate.status, 409);
  assert.equal(duplicate.body.code, "DUPLICATE_PAYMENT_ATTEMPT");
});

