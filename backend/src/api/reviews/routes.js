import { createGetReviewDraftController } from "./get-review-draft-controller.js";
import { createPostSubmitReviewController } from "./post-submit-review-controller.js";
import { createGetSubmittedReviewController } from "./get-submitted-review-controller.js";

export function createReviewRoutes(deps) {
  const draftController = createGetReviewDraftController(deps);
  const submitController = createPostSubmitReviewController(deps);
  const submittedController = createGetSubmittedReviewController(deps);
  return {
    "/api/v1/assignments/:assignmentId/review-draft:GET": draftController.get,
    "/api/v1/assignments/:assignmentId/reviews/submit:POST": submitController.post,
    "/api/v1/reviews/:reviewId:GET": submittedController.get
  };
}

