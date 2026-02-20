import { saveDraft } from "./save-draft-orchestrator.js";
import { validateFinalize } from "./draft-save-validation-service.js";

export function finalizeDraft(deps, request) {
  const now = deps.nowProvider ? deps.nowProvider() : new Date();
  const draftId = request.params?.draftId;
  deps.finalizeOrderingObservabilityService?.record("finalize_prevalidation_save_start", { draftId });
  const saveResult = saveDraft(deps, request);
  deps.finalizeOrderingObservabilityService?.record("finalize_prevalidation_save_end", {
    draftId,
    saveStatus: saveResult.body?.status
  });

  if (![200].includes(saveResult.status)) {
    return saveResult;
  }

  const draft = deps.submissionDraftRepository.get(draftId);
  const finalValidation = validateFinalize(draft?.editableState ?? {});
  deps.finalizeOrderingObservabilityService?.record("finalize_final_validation", {
    draftId,
    valid: finalValidation.valid
  });
  if (!finalValidation.valid) {
    return {
      status: 409,
      body: {
        code: "FINAL_VALIDATION_FAILED",
        message: "Final submission validation failed.",
        errors: finalValidation.errors,
        draft_saved: true
      }
    };
  }

  deps.submissionDraftRepository.update(draftId, (entry) => {
    entry.status = "FINALIZED";
    entry.updatedAt = now.toISOString();
  });
  return {
    status: 200,
    body: {
      status: "FINALIZED",
      draft_id: draftId
    }
  };
}
