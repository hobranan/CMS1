import { createGetCompletedReviewsController } from "./get-completed-reviews-controller.js";
import { createGetCompletedReviewDetailController } from "./get-completed-review-detail-controller.js";

export function createReviewViewRoutes(deps) {
  const listController = createGetCompletedReviewsController(deps);
  const detailController = createGetCompletedReviewDetailController(deps);
  return {
    "/api/v1/papers/:paperId/completed-reviews:GET": listController.get,
    "/api/v1/papers/:paperId/completed-reviews/:reviewId:GET": detailController.get
  };
}
