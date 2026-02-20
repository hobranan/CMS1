import { createGetPaperDecisionController } from "./get-paper-decision.js";
import { createGetDecisionNotificationController } from "./get-decision-notification.js";

export function createDecisionNotificationRoutes(deps) {
  const decisionController = createGetPaperDecisionController(deps);
  const notificationController = createGetDecisionNotificationController(deps);

  return {
    "/api/v1/author/papers/:paperId/decision:GET": decisionController.get,
    "/api/v1/author/papers/:paperId/decision-notification:GET": notificationController.get
  };
}
