import test from "node:test";
import assert from "node:assert/strict";
import { createUc10System } from "../../helpers/uc10_system.js";

test("second stale response attempt returns canonical 409 conflict", () => {
  const system = createUc10System();
  const referee = system.addReferee("ref8@example.com");
  const invitation = system.seedInvitation({ refereeId: referee.id });

  const first = system.call("/api/v1/invitations/:invitationId/response:POST", {
    params: { invitationId: invitation.invitationId },
    body: { decision: "accept", expected_status: "pending" },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });
  assert.equal(first.status, 200);

  const second = system.call("/api/v1/invitations/:invitationId/response:POST", {
    params: { invitationId: invitation.invitationId },
    body: { decision: "reject", expected_status: "pending" },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });
  assert.equal(second.status, 409);
  assert.equal(second.body.message, "Invitation state changed. Refresh and try again.");
});

