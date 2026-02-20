import { saveDraft } from "../../services/drafts/save-draft-orchestrator.js";

export function createSaveDraftController(deps) {
  return {
    save: (request) => saveDraft(deps, request)
  };
}
