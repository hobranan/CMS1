import test from "node:test";
import assert from "node:assert/strict";
import { createUc11System } from "../../helpers/uc11_system.js";

test("review form endpoint returns pre-generated form for assigned paper", () => {
  const system = createUc11System();
  const referee = system.addReferee("ref4@example.com");
  system.deps.assignedPaperRepository.seedAssignment({
    refereeId: referee.id,
    paperId: "paper-3",
    title: "Paper Three"
  });
  system.deps.assignedPaperRepository.seedReviewForm({
    paperId: "paper-3",
    reviewFormId: "form-3",
    preGenerated: true
  });

  const response = system.call("/api/v1/papers/:paperId/review-form:GET", {
    params: { paperId: "paper-3" },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });
  assert.equal(response.status, 200);
  assert.equal(response.body.preGenerated, true);
});

