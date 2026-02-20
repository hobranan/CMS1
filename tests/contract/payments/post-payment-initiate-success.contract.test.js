import test from "node:test";
import assert from "node:assert/strict";
import { createUc20System } from "../../helpers/uc20_system.js";

test("payment initiation succeeds for authenticated attendee with selected category", () => {
  const system = createUc20System();
  const user = system.addUser("attendee20@example.test");
  system.seedRegistration({ registrationId: "reg-20-1", attendeeId: user.id, amount: 425, currency: "CAD" });

  const response = system.call("/api/v1/registrations/:registrationId/payment/initiate:POST", {
    user,
    params: { registrationId: "reg-20-1" },
    body: { categoryId: "standard" }
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.currency, "CAD");
  assert.match(response.body.gatewayRedirectUrl, /checkout\?attemptId=/);
});

