import { finalizeDraft } from "../../services/drafts/finalize-draft-service.js";

export function createFinalizeDraftController(deps) {
  return {
    finalize: (request) => finalizeDraft(deps, request)
  };
}
