import test from "node:test";
import assert from "node:assert/strict";
import { createUc10System } from "../../helpers/uc10_system.js";

test("notification failure preserves committed response with failed notification status", () => {
  const system = createUc10System();
  const referee = system.addReferee("ref6@example.com");
  const invitation = system.seedInvitation({ refereeId: referee.id });
  system.deps.invitationNotificationService.failNextSend();

  const response = system.call("/api/v1/invitations/:invitationId/response:POST", {
    params: { invitationId: invitation.invitationId },
    body: { decision: "accept", expected_status: "pending" },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.notificationStatus, "failed");
  assert.equal(system.deps.reviewInvitationRepository.get(invitation.invitationId).status, "accepted");
});

