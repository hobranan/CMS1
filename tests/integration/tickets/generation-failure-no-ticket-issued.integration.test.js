import test from "node:test";
import assert from "node:assert/strict";
import { createUc21System } from "../../helpers/uc21_system.js";

test("generation failure prevents ticket issuance", () => {
  const system = createUc21System();
  const user = system.addUser("uc21-generationfail@example.test");
  const registrationId = "uc21-int-7";
  system.seedPaidRegistration(registrationId, user.id);
  system.failTicketGeneration();

  const issue = system.call("/api/v1/registrations/:registrationId/ticket/issue:POST", {
    user,
    params: { registrationId }
  });
  assert.equal(issue.status, 500);

  const metadata = system.call("/api/v1/account/registrations/:registrationId/ticket:GET", {
    user,
    params: { registrationId }
  });
  assert.equal(metadata.status, 404);
});

