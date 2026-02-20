import test from "node:test";
import assert from "node:assert/strict";
import { createUc10System } from "../../helpers/uc10_system.js";

test("pending invitations endpoint returns only actionable pending items", () => {
  const system = createUc10System();
  const referee = system.addReferee("ref12@example.com");
  const now = "2026-02-20T00:00:00.000Z";
  system.setNow(now);
  system.seedInvitation({ refereeId: referee.id, issuedAtIso: "2026-02-19T00:00:00.000Z", status: "pending" });
  system.seedInvitation({ refereeId: referee.id, issuedAtIso: "2026-02-01T00:00:00.000Z", status: "pending" });
  system.seedInvitation({ refereeId: referee.id, issuedAtIso: "2026-02-19T00:00:00.000Z", status: "accepted" });

  const response = system.call("/api/v1/referees/:refereeId/invitations/pending:GET", {
    params: { refereeId: referee.id },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.invitations.length, 1);
  assert.equal(response.body.invitations[0].status, "pending");
});

