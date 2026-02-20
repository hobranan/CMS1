import { createGetDecisionContextController } from "./get-decision-context-controller.js";
import { createPostPaperDecisionController } from "./post-paper-decision-controller.js";

export function createDecisionRoutes(deps) {
  const contextController = createGetDecisionContextController(deps);
  const decisionController = createPostPaperDecisionController(deps);

  return {
    "/api/v1/papers/:paperId/decision-context:GET": contextController.get,
    "/api/v1/papers/:paperId/decision:POST": decisionController.post
  };
}
