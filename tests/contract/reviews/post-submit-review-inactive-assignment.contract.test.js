import test from "node:test";
import assert from "node:assert/strict";
import { createUc12System } from "../../helpers/uc12_system.js";

test("submit review rejects inactive assignment", () => {
  const system = createUc12System();
  const referee = system.addReferee("ref4@example.com");
  system.deps.reviewSubmissionRepository.seedAssignment({
    assignmentId: "a-4",
    refereeId: referee.id,
    status: "completed"
  });

  const res = system.call("/api/v1/assignments/:assignmentId/reviews/submit:POST", {
    params: { assignmentId: "a-4" },
    user: { email: referee.email, id: referee.id, role: "referee" },
    body: {
      fields: { novelty: "x" },
      recommendation: "accept"
    }
  });
  assert.equal(res.status, 403);
});

