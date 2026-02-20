import { detectDraftChanges } from "./draft-change-detection-service.js";
import { validateDraftSave } from "./draft-save-validation-service.js";
import { logSaveOutcome } from "./save-attempt-logging-service.js";
import { mapSaveSystemFailure } from "../../api/drafts/save-error-mapper.js";

export function saveDraft(deps, request) {
  const now = deps.nowProvider ? deps.nowProvider() : new Date();
  const draftId = request.params?.draftId;
  const editableState = request.body?.editable_state ?? {};
  if (!request.user?.email) {
    return { status: 401, body: { code: "AUTH_REQUIRED", message: "Authentication is required." } };
  }
  const draft = deps.submissionDraftRepository.get(draftId);
  if (!draft || draft.authorEmail !== request.user.email) {
    return { status: 404, body: { code: "DRAFT_NOT_FOUND", message: "Draft not found." } };
  }
  if (draft.status === "FINALIZED") {
    return { status: 409, body: { code: "DRAFT_FINALIZED", message: "Draft is already finalized." } };
  }

  const validation = validateDraftSave(editableState);
  if (!validation.valid) {
    logSaveOutcome(deps.saveAttemptRepository, draftId, "VALIDATION_FAILED", now);
    return {
      status: 400,
      body: {
        status: "VALIDATION_FAILED",
        errors: validation.errors
      }
    };
  }

  const change = detectDraftChanges(draft, editableState);
  if (!change.changed) {
    logSaveOutcome(deps.saveAttemptRepository, draftId, "NO_CHANGES", now);
    return {
      status: 200,
      body: {
        status: "NO_CHANGES",
        last_saved_at: draft.lastSavedAt
      }
    };
  }

  try {
    const persisted = deps.draftPersistenceService.persistDraftState({
      draftId,
      editableState,
      stateHash: change.nextHash,
      now
    });
    logSaveOutcome(deps.saveAttemptRepository, draftId, "SAVED", now);
    return {
      status: 200,
      body: {
        status: "SAVED",
        draft_id: draftId,
        last_saved_at: persisted.lastSavedAt
      }
    };
  } catch (error) {
    logSaveOutcome(deps.saveAttemptRepository, draftId, error.code ?? "SYSTEM_FAILURE", now);
    return mapSaveSystemFailure(error.code);
  }
}
