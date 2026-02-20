import { getCompletedReviews } from "../../services/review-view/get-completed-reviews-service.js";
import { mapRetrievalOutcome } from "../../services/review-view/review-retrieval-outcome-service.js";

export function createGetCompletedReviewsController(deps) {
  return {
    get: (request) => {
      if (!request.user?.email || request.user?.role !== "editor") {
        return { status: 401, body: { code: "AUTH_REQUIRED", message: "Editor authentication is required." } };
      }
      const result = getCompletedReviews(deps, {
        editorId: request.user.id,
        paperId: request.params?.paperId
      });
      if (result.outcome !== "ok") {
        return mapRetrievalOutcome(result.outcome);
      }
      return { status: 200, body: { reviews: result.reviews } };
    }
  };
}
