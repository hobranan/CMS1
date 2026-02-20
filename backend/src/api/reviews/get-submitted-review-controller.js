import { asSubmittedReviewRecord } from "../../models/submitted-review.js";
import { ensureSubmittedReviewReadOnly } from "../../services/reviews/submitted-review-immutability-service.js";

export function createGetSubmittedReviewController(deps) {
  return {
    get: (request) => {
      if (!request.user?.email) {
        return { status: 401, body: { code: "AUTH_REQUIRED", message: "Authentication is required." } };
      }
      const reviewId = request.params?.reviewId;
      const review = deps.reviewSubmissionRepository.getSubmittedReview(reviewId);
      if (!review) {
        return { status: 404, body: { code: "REVIEW_NOT_FOUND", message: "Submitted review not found." } };
      }
      if (request.user.role === "referee") {
        const assignment = deps.reviewSubmissionRepository.getAssignment(review.assignmentId);
        if (!assignment || assignment.refereeId !== request.user.id) {
          return { status: 403, body: { code: "FORBIDDEN", message: "Review access denied." } };
        }
      }
      if (request.user.role === "editor") {
        const assignment = deps.reviewSubmissionRepository.getAssignment(review.assignmentId);
        if (!assignment || assignment.editorId !== request.user.id) {
          return { status: 403, body: { code: "FORBIDDEN", message: "Review access denied." } };
        }
      }
      return {
        status: 200,
        body: ensureSubmittedReviewReadOnly(asSubmittedReviewRecord(review))
      };
    }
  };
}

