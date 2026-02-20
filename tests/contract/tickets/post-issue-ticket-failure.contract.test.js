import test from "node:test";
import assert from "node:assert/strict";
import { createUc21System } from "../../helpers/uc21_system.js";

test("issue ticket returns 500 when generation fails", () => {
  const system = createUc21System();
  const user = system.addUser("uc21-genfail@example.test");
  const registrationId = "uc21-reg-5";
  system.seedPaidRegistration(registrationId, user.id);
  system.failTicketGeneration();

  const response = system.call("/api/v1/registrations/:registrationId/ticket/issue:POST", {
    user,
    params: { registrationId }
  });

  assert.equal(response.status, 500);
  assert.equal(response.body.code, "TICKET_GENERATION_FAILED");
});

