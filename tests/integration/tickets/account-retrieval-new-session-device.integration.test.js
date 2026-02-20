import test from "node:test";
import assert from "node:assert/strict";
import { createUc21System } from "../../helpers/uc21_system.js";

test("ticket is retrievable across new session/device access", () => {
  const system = createUc21System();
  const user = system.addUser("uc21-session@example.test");
  const registrationId = "uc21-int-4";
  system.seedPaidRegistration(registrationId, user.id);
  system.call("/api/v1/registrations/:registrationId/ticket/issue:POST", { user, params: { registrationId } });

  const newSessionUser = { id: user.id };
  const pdf = system.call("/api/v1/account/registrations/:registrationId/ticket.pdf:GET", {
    user: newSessionUser,
    params: { registrationId }
  });
  assert.equal(pdf.status, 200);
});

