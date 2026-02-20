import test from "node:test";
import assert from "node:assert/strict";
import { createUc10System } from "../../helpers/uc10_system.js";

test("response at exact 14-day boundary is blocked as expired", () => {
  const system = createUc10System();
  const referee = system.addReferee("ref4@example.com");
  const issuedAt = "2026-02-01T00:00:00.000Z";
  system.setNow("2026-02-15T00:00:00.000Z");
  const invitation = system.seedInvitation({
    refereeId: referee.id,
    issuedAtIso: issuedAt,
    status: "pending"
  });

  const response = system.call("/api/v1/invitations/:invitationId/response:POST", {
    params: { invitationId: invitation.invitationId },
    body: { decision: "accept", expected_status: "pending" },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });

  assert.equal(response.status, 400);
  assert.equal(response.body.code, "INVITATION_EXPIRED");
});

