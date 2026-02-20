import test from "node:test";
import assert from "node:assert/strict";
import { createUc20System } from "../../helpers/uc20_system.js";

const outcomes = ["canceled", "invalid", "declined"];

for (const gatewayStatus of outcomes) {
  test(`non-success outcome ${gatewayStatus} preserves unpaid state`, () => {
    const system = createUc20System();
    const user = system.addUser(`uc20-${gatewayStatus}@example.test`);
    const registrationId = `uc20-reg-${gatewayStatus}`;
    system.seedRegistration({ registrationId, attendeeId: user.id });
    const initiate = system.call("/api/v1/registrations/:registrationId/payment/initiate:POST", {
      user,
      params: { registrationId },
      body: { categoryId: "regular" }
    });
    system.call("/api/v1/payments/gateway/confirm:POST", {
      body: {
        attemptId: initiate.body.attemptId,
        gatewayStatus,
        gatewayReference: `gw-${gatewayStatus}`,
        signature: "valid-signature"
      }
    });
    const status = system.call("/api/v1/registrations/:registrationId/payment/status:GET", {
      user,
      params: { registrationId }
    });
    assert.equal(status.body.registrationState, "unpaid");
  });
}

