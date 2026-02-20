import test from "node:test";
import assert from "node:assert/strict";
import { createUc21System } from "../../helpers/uc21_system.js";

test("issue ticket returns 409 when payment is pending", () => {
  const system = createUc21System();
  const user = system.addUser("uc21-pending@example.test");
  const registrationId = "uc21-reg-4";
  system.seedPendingRegistration(registrationId, user.id);

  const response = system.call("/api/v1/registrations/:registrationId/ticket/issue:POST", {
    user,
    params: { registrationId }
  });

  assert.equal(response.status, 409);
  assert.equal(response.body.code, "PAYMENT_PENDING_OR_UNRESOLVED");
});

