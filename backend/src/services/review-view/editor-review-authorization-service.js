import { canEditorAccessPaper } from "../../models/paper-review-access.js";

export function authorizeEditorPaperAccess(repository, editorId, paperId) {
  const assignments = repository.listAssignmentsByPaper(paperId);
  if (assignments.length === 0) {
    return { ok: true, hasAssignments: false };
  }
  const allowed = assignments.some((assignment) => canEditorAccessPaper(assignment, editorId));
  return { ok: allowed, hasAssignments: true };
}

export function authorizeEditorReviewAccess(repository, editorId, reviewId) {
  const review = repository.getSubmittedReview(reviewId);
  if (!review) return { ok: false, code: "review_not_found" };
  const assignment = repository.getAssignment(review.assignmentId);
  if (!canEditorAccessPaper(assignment, editorId)) {
    return { ok: false, code: "unauthorized" };
  }
  return { ok: true, review, assignment };
}
