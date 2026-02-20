import { interruptionResponse } from "../../services/submissions/submission-error-mapper.js";
import { markUploadInterrupted } from "../../services/submissions/submission-state-service.js";

export function createUploadStatusController(deps) {
  return {
    reportStatus: (request) => {
      const now = deps.nowProvider ? deps.nowProvider() : new Date();
      const submissionId = request.body?.submission_id;
      const status = request.body?.status;
      if (!submissionId || status !== "INTERRUPTED") {
        return { status: 400, body: { code: "INVALID_UPLOAD_STATUS", message: "submission_id and INTERRUPTED status are required." } };
      }
      markUploadInterrupted(deps.paperSubmissionRepository, submissionId, now);
      deps.submissionObservabilityService?.record("upload_interrupted", { submissionId });
      return interruptionResponse(submissionId);
    }
  };
}
