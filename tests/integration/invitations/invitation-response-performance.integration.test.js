import test from "node:test";
import assert from "node:assert/strict";
import { createUc10System } from "../../helpers/uc10_system.js";

test("invitation-response decision p95 latency is below 300ms", () => {
  const system = createUc10System();
  const referee = system.addReferee("ref11@example.com");
  const samples = [];

  for (let i = 0; i < 30; i += 1) {
    const invitation = system.seedInvitation({ refereeId: referee.id, paperId: `paper-${i}` });
    const start = Date.now();
    const response = system.call("/api/v1/invitations/:invitationId/response:POST", {
      params: { invitationId: invitation.invitationId },
      body: { decision: "accept", expected_status: "pending" },
      user: { email: referee.email, id: referee.id, role: "referee" }
    });
    const elapsed = Date.now() - start;
    assert.equal(response.status, 200);
    samples.push(elapsed);
  }

  const sorted = [...samples].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95) - 1];
  assert.ok(p95 < 300, `Expected p95 < 300ms, got ${p95}ms`);
});

