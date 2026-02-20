import { mapSubmissionSuccess } from "./submission-response-mapper.js";
import { storageFailure, validationFailure } from "./submission-error-mapper.js";
import { validateSubmissionInput } from "./submission-validation-service.js";

export function finalizeSubmission(deps, request) {
  const now = deps.nowProvider ? deps.nowProvider() : new Date();
  if (!request.user?.email) {
    return { status: 401, body: { code: "AUTH_REQUIRED", message: "Authentication is required." } };
  }

  const validation = validateSubmissionInput(request.body, request.file);
  if (!validation.valid) {
    deps.submissionObservabilityService?.record("submission_validation_failed", {
      authorEmail: request.user.email,
      errorCount: validation.errors.length
    });
    return validationFailure(validation.errors);
  }

  try {
    const finalized = deps.submissionPersistenceService.saveFinalizedSubmission({
      authorEmail: request.user.email,
      metadata: validation.metadata,
      manuscriptFile: request.file,
      now
    });
    deps.submissionObservabilityService?.record("submission_finalized", { authorEmail: request.user.email });
    return mapSubmissionSuccess(finalized);
  } catch {
    deps.submissionObservabilityService?.record("submission_storage_failed", { authorEmail: request.user.email });
    return storageFailure();
  }
}
