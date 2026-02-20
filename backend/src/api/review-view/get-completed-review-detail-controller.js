import { getCompletedReviewDetail } from "../../services/review-view/get-completed-review-detail-service.js";
import { mapRetrievalOutcome } from "../../services/review-view/review-retrieval-outcome-service.js";

export function createGetCompletedReviewDetailController(deps) {
  return {
    get: (request) => {
      if (!request.user?.email || request.user?.role !== "editor") {
        return { status: 401, body: { code: "AUTH_REQUIRED", message: "Editor authentication is required." } };
      }
      const result = getCompletedReviewDetail(deps, {
        editorId: request.user.id,
        paperId: request.params?.paperId,
        reviewId: request.params?.reviewId
      });
      if (result.outcome !== "ok") {
        return mapRetrievalOutcome(result.outcome);
      }
      return { status: 200, body: result.review };
    }
  };
}


