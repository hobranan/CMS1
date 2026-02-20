import { createFinalizeDraftController } from "./finalize-draft-controller.js";
import { createGetDraftController } from "./get-draft-controller.js";
import { createSaveDraftController } from "./save-draft-controller.js";

export function createDraftRoutes(deps) {
  const saveController = createSaveDraftController(deps);
  const getController = createGetDraftController(deps);
  const finalizeController = createFinalizeDraftController(deps);
  return {
    "/api/v1/drafts/:draftId/save:POST": saveController.save,
    "/api/v1/drafts/:draftId:GET": getController.get,
    "/api/v1/drafts/:draftId/finalize:POST": finalizeController.finalize
  };
}
