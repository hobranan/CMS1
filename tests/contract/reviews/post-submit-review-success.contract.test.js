import test from "node:test";
import assert from "node:assert/strict";
import { createUc12System } from "../../helpers/uc12_system.js";

test("submit review succeeds for active assignment and valid fields", () => {
  const system = createUc12System();
  const referee = system.addReferee("ref2@example.com");
  system.deps.reviewSubmissionRepository.seedAssignment({
    assignmentId: "a-2",
    refereeId: referee.id,
    status: "active"
  });

  const res = system.call("/api/v1/assignments/:assignmentId/reviews/submit:POST", {
    params: { assignmentId: "a-2" },
    user: { email: referee.email, id: referee.id, role: "referee" },
    body: {
      fields: { novelty: "good", clarity: "clear" },
      recommendation: "accept",
      comments: "Well written."
    }
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.status, "submitted");
  assert.equal(res.body.assignmentStatus, "completed");
  assert.equal(res.body.versionNumber, 1);
});

