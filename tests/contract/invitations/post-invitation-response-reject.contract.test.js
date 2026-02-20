import test from "node:test";
import assert from "node:assert/strict";
import { createUc10System } from "../../helpers/uc10_system.js";

test("reject response records rejected status and keeps assignment inactive", () => {
  const system = createUc10System();
  const referee = system.addReferee("ref2@example.com");
  const invitation = system.seedInvitation({ refereeId: referee.id });

  const response = system.call("/api/v1/invitations/:invitationId/response:POST", {
    params: { invitationId: invitation.invitationId },
    body: { decision: "reject", expected_status: "pending" },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.status, "rejected");
  assert.equal(response.body.assignmentActive, false);
});

