import test from "node:test";
import assert from "node:assert/strict";
import { createUc12System } from "../../helpers/uc12_system.js";

test("sequential submissions maintain version linkage chain", () => {
  const system = createUc12System();
  const referee = system.addReferee("ref9@example.com");
  system.deps.reviewSubmissionRepository.seedAssignment({
    assignmentId: "a-9",
    refereeId: referee.id,
    status: "active"
  });

  const first = system.call("/api/v1/assignments/:assignmentId/reviews/submit:POST", {
    params: { assignmentId: "a-9" },
    user: { email: referee.email, id: referee.id, role: "referee" },
    body: { fields: { novelty: "1" }, recommendation: "accept" }
  });
  system.deps.reviewSubmissionRepository.updateAssignmentStatus("a-9", "active");
  const second = system.call("/api/v1/assignments/:assignmentId/reviews/submit:POST", {
    params: { assignmentId: "a-9" },
    user: { email: referee.email, id: referee.id, role: "referee" },
    body: { fields: { novelty: "2" }, recommendation: "reject" }
  });
  assert.equal(second.body.previousReviewId, first.body.reviewId);
});

