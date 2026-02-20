import test from "node:test";
import assert from "node:assert/strict";
import { createUc11System } from "../../helpers/uc11_system.js";

test("non-assigned manuscript and review form access are forbidden", () => {
  const system = createUc11System();
  const referee = system.addReferee("ref5@example.com");
  system.deps.assignedPaperRepository.seedManuscript({
    paperId: "paper-4",
    contentUrl: "https://example.com/m4"
  });
  system.deps.assignedPaperRepository.seedReviewForm({
    paperId: "paper-4",
    reviewFormId: "form-4",
    preGenerated: true
  });

  const manuscript = system.call("/api/v1/papers/:paperId/manuscript-view:GET", {
    params: { paperId: "paper-4" },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });
  assert.equal(manuscript.status, 403);

  const reviewForm = system.call("/api/v1/papers/:paperId/review-form:GET", {
    params: { paperId: "paper-4" },
    user: { email: referee.email, id: referee.id, role: "referee" }
  });
  assert.equal(reviewForm.status, 403);
});

