import { createConfirmAssignmentController } from "./confirm-assignment-controller.js";
import { createGetAssignmentDetailsController } from "./get-assignment-details-controller.js";

export function createAssignmentRoutes(deps) {
  const confirmController = createConfirmAssignmentController(deps);
  const getController = createGetAssignmentDetailsController(deps);

  return {
    "/api/v1/papers/:paperId/assignments:POST": confirmController.confirm,
    "/api/v1/papers/:paperId/assignments:GET": getController.get
  };
}

