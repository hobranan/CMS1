import test from "node:test";
import assert from "node:assert/strict";
import { createUc21System } from "../../helpers/uc21_system.js";

test("ticket remains retrievable after navigating away", () => {
  const system = createUc21System();
  const user = system.addUser("uc21-nav@example.test");
  const registrationId = "uc21-int-3";
  system.seedPaidRegistration(registrationId, user.id);
  system.call("/api/v1/registrations/:registrationId/ticket/issue:POST", { user, params: { registrationId } });

  const metadata = system.call("/api/v1/account/registrations/:registrationId/ticket:GET", {
    user,
    params: { registrationId }
  });
  assert.equal(metadata.status, 200);
  assert.equal(metadata.body.retrievalAvailable, true);
});

