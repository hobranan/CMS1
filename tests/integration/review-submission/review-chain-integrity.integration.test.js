import test from "node:test";
import assert from "node:assert/strict";
import { createUc12System } from "../../helpers/uc12_system.js";

test("review chain integrity keeps monotonic versions and latest-link invariants", () => {
  const system = createUc12System();
  const referee = system.addReferee("ref11@example.com");
  system.deps.reviewSubmissionRepository.seedAssignment({
    assignmentId: "a-11",
    refereeId: referee.id,
    status: "active"
  });

  const v1 = system.call("/api/v1/assignments/:assignmentId/reviews/submit:POST", {
    params: { assignmentId: "a-11" },
    user: { email: referee.email, id: referee.id, role: "referee" },
    body: { fields: { novelty: "v1" }, recommendation: "accept" }
  });
  system.deps.reviewSubmissionRepository.updateAssignmentStatus("a-11", "active");
  const v2 = system.call("/api/v1/assignments/:assignmentId/reviews/submit:POST", {
    params: { assignmentId: "a-11" },
    user: { email: referee.email, id: referee.id, role: "referee" },
    body: { fields: { novelty: "v2" }, recommendation: "reject" }
  });

  const reviews = system.deps.reviewSubmissionRepository.listSubmittedForAssignment("a-11");
  assert.equal(reviews.length, 2);
  assert.equal(reviews[0].versionNumber, 1);
  assert.equal(reviews[1].versionNumber, 2);
  assert.equal(v2.body.previousReviewId, v1.body.reviewId);
  assert.equal(system.deps.reviewSubmissionRepository.getLatestSubmitted("a-11").reviewId, v2.body.reviewId);
});

