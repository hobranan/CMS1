import { createGetAssignedPapersController } from "./get-assigned-papers-controller.js";
import { createGetManuscriptViewController } from "./get-manuscript-view-controller.js";
import { createGetReviewFormController } from "./get-review-form-controller.js";

export function createAssignedAccessRoutes(deps) {
  const assignedController = createGetAssignedPapersController(deps);
  const manuscriptController = createGetManuscriptViewController(deps);
  const reviewFormController = createGetReviewFormController(deps);
  return {
    "/api/v1/referees/:refereeId/assigned-papers:GET": assignedController.get,
    "/api/v1/papers/:paperId/manuscript-view:GET": manuscriptController.get,
    "/api/v1/papers/:paperId/review-form:GET": reviewFormController.get
  };
}

