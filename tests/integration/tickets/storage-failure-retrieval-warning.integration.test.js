import test from "node:test";
import assert from "node:assert/strict";
import { createUc21System } from "../../helpers/uc21_system.js";

test("storage failure returns warning and retrieval is unavailable", () => {
  const system = createUc21System();
  const user = system.addUser("uc21-storagefail@example.test");
  const registrationId = "uc21-int-8";
  system.seedPaidRegistration(registrationId, user.id);
  system.failTicketStorage();

  const issue = system.call("/api/v1/registrations/:registrationId/ticket/issue:POST", {
    user,
    params: { registrationId }
  });
  assert.equal(issue.status, 500);
  assert.equal(issue.body.code, "TICKET_STORAGE_FAILED");
});

