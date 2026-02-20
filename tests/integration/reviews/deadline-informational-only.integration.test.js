import test from "node:test";
import assert from "node:assert/strict";
import { createUc12System } from "../../helpers/uc12_system.js";

test("passed displayed deadline does not block active assignment submission", () => {
  const system = createUc12System();
  const referee = system.addReferee("ref8@example.com");
  system.setNow("2026-03-20T00:00:00.000Z");
  system.deps.reviewSubmissionRepository.seedAssignment({
    assignmentId: "a-8",
    refereeId: referee.id,
    status: "active",
    deadlineIndicator: "2026-03-01T00:00:00.000Z"
  });

  const res = system.call("/api/v1/assignments/:assignmentId/reviews/submit:POST", {
    params: { assignmentId: "a-8" },
    user: { email: referee.email, id: referee.id, role: "referee" },
    body: { fields: { novelty: "ok" }, recommendation: "accept" }
  });
  assert.equal(res.status, 200);
});

