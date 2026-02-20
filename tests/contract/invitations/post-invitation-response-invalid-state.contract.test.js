import test from "node:test";
import assert from "node:assert/strict";
import { createUc10System } from "../../helpers/uc10_system.js";

test("response to withdrawn invitation is blocked", () => {
  const system = createUc10System();
  const referee = system.addReferee("ref3@example.com");
  const invitation = system.seedInvitation({ refereeId: referee.id, status: "withdrawn" });

  const response = system.call("/api/v1/invitations/:invitationId/response:POST", {
    params: { invitationId: invitation.invitationId },
    body: { decision: "accept", expected_status: "withdrawn" },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.code, "INVITATION_WITHDRAWN");
});

