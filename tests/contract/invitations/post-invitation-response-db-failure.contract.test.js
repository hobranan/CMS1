import test from "node:test";
import assert from "node:assert/strict";
import { createUc10System } from "../../helpers/uc10_system.js";

test("db failure returns 500 and keeps invitation pending", () => {
  const system = createUc10System();
  const referee = system.addReferee("ref5@example.com");
  const invitation = system.seedInvitation({ refereeId: referee.id });
  system.deps.invitationResponsePersistenceService.failNextWrite();

  const response = system.call("/api/v1/invitations/:invitationId/response:POST", {
    params: { invitationId: invitation.invitationId },
    body: { decision: "accept", expected_status: "pending" },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });

  assert.equal(response.status, 500);
  assert.equal(response.body.code, "INVITATION_DB_FAILURE");
  assert.equal(system.deps.reviewInvitationRepository.get(invitation.invitationId).status, "pending");
});

