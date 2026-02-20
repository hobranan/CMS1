import test from "node:test";
import assert from "node:assert/strict";
import { createUc10System } from "../../helpers/uc10_system.js";

test("accept response records accepted status and activates assignment", () => {
  const system = createUc10System();
  const referee = system.addReferee("ref1@example.com");
  const invitation = system.seedInvitation({ refereeId: referee.id });

  const response = system.call("/api/v1/invitations/:invitationId/response:POST", {
    params: { invitationId: invitation.invitationId },
    body: { decision: "accept", expected_status: "pending" },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.status, "accepted");
  assert.equal(response.body.assignmentActive, true);
  assert.equal(response.body.notificationStatus, "sent");
});

