import test from "node:test";
import assert from "node:assert/strict";
import { createUc12System } from "../../helpers/uc12_system.js";

test("new submitted version links to latest prior review", () => {
  const system = createUc12System();
  const referee = system.addReferee("ref6@example.com");
  system.deps.reviewSubmissionRepository.seedAssignment({
    assignmentId: "a-6",
    refereeId: referee.id,
    status: "active"
  });

  const first = system.call("/api/v1/assignments/:assignmentId/reviews/submit:POST", {
    params: { assignmentId: "a-6" },
    user: { email: referee.email, id: referee.id, role: "referee" },
    body: { fields: { novelty: "v1" }, recommendation: "accept" }
  });
  system.deps.reviewSubmissionRepository.updateAssignmentStatus("a-6", "active");
  const second = system.call("/api/v1/assignments/:assignmentId/reviews/submit:POST", {
    params: { assignmentId: "a-6" },
    user: { email: referee.email, id: referee.id, role: "referee" },
    body: { fields: { novelty: "v2" }, recommendation: "reject" }
  });

  assert.equal(second.status, 200);
  assert.equal(second.body.versionNumber, 2);
  assert.equal(second.body.previousReviewId, first.body.reviewId);
});

