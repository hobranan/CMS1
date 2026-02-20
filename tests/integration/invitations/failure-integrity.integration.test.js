import test from "node:test";
import assert from "node:assert/strict";
import { createUc10System } from "../../helpers/uc10_system.js";

test("db failure keeps pending and notification failure keeps committed response", () => {
  const system = createUc10System();
  const referee = system.addReferee("ref10@example.com");
  const dbFailInvitation = system.seedInvitation({ refereeId: referee.id, paperId: "paper-c" });
  system.deps.invitationResponsePersistenceService.failNextWrite();

  const dbFail = system.call("/api/v1/invitations/:invitationId/response:POST", {
    params: { invitationId: dbFailInvitation.invitationId },
    body: { decision: "accept", expected_status: "pending" },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });
  assert.equal(dbFail.status, 500);
  assert.equal(system.deps.reviewInvitationRepository.get(dbFailInvitation.invitationId).status, "pending");

  const notifyFailInvitation = system.seedInvitation({ refereeId: referee.id, paperId: "paper-d" });
  system.deps.invitationNotificationService.failNextSend();
  const notifyFail = system.call("/api/v1/invitations/:invitationId/response:POST", {
    params: { invitationId: notifyFailInvitation.invitationId },
    body: { decision: "accept", expected_status: "pending" },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });
  assert.equal(notifyFail.status, 200);
  assert.equal(notifyFail.body.notificationStatus, "failed");
  assert.equal(system.deps.reviewInvitationRepository.get(notifyFailInvitation.invitationId).status, "accepted");
});

