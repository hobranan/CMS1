import test from "node:test";
import assert from "node:assert/strict";
import { createUc10System } from "../../helpers/uc10_system.js";

test("accept activates assignment while reject keeps it inactive", () => {
  const system = createUc10System();
  const referee = system.addReferee("ref7@example.com");
  const acceptInvitation = system.seedInvitation({ refereeId: referee.id, paperId: "paper-a" });
  const rejectInvitation = system.seedInvitation({ refereeId: referee.id, paperId: "paper-b" });

  const accepted = system.call("/api/v1/invitations/:invitationId/response:POST", {
    params: { invitationId: acceptInvitation.invitationId },
    body: { decision: "accept", expected_status: "pending" },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });
  assert.equal(accepted.status, 200);
  assert.equal(system.deps.reviewAssignmentActivationRepository.isActive(acceptInvitation.invitationId), true);

  const rejected = system.call("/api/v1/invitations/:invitationId/response:POST", {
    params: { invitationId: rejectInvitation.invitationId },
    body: { decision: "reject", expected_status: "pending" },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });
  assert.equal(rejected.status, 200);
  assert.equal(system.deps.reviewAssignmentActivationRepository.isActive(rejectInvitation.invitationId), false);
});

