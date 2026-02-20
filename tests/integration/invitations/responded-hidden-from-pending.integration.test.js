import test from "node:test";
import assert from "node:assert/strict";
import { createUc10System } from "../../helpers/uc10_system.js";

test("responded invitation is removed from pending list projection", () => {
  const system = createUc10System();
  const referee = system.addReferee("ref13@example.com");
  const invitation = system.seedInvitation({ refereeId: referee.id });

  const before = system.call("/api/v1/referees/:refereeId/invitations/pending:GET", {
    params: { refereeId: referee.id },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });
  assert.equal(before.body.invitations.length, 1);

  system.call("/api/v1/invitations/:invitationId/response:POST", {
    params: { invitationId: invitation.invitationId },
    body: { decision: "reject", expected_status: "pending" },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });

  const after = system.call("/api/v1/referees/:refereeId/invitations/pending:GET", {
    params: { refereeId: referee.id },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });
  assert.equal(after.body.invitations.length, 0);
});

