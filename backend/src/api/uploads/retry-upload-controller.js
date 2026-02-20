import { resolveRetryMode } from "../../services/uploads/upload-progress-service.js";

export function createRetryUploadController(deps) {
  return {
    retryMode: (request) => {
      const now = deps.nowProvider ? deps.nowProvider() : new Date();
      const submissionId = request.params?.submissionId;
      const fileFingerprint = request.body?.file_fingerprint;
      if (!submissionId || !fileFingerprint) {
        return { status: 400, body: { code: "INVALID_RETRY_REQUEST", message: "submissionId and file_fingerprint are required." } };
      }
      const mode = resolveRetryMode(
        deps.uploadProgressStateRepository,
        submissionId,
        fileFingerprint,
        now
      );
      deps.uploadObservabilityService?.record("upload_retry_mode_selected", { submissionId, mode: mode.mode });
      return {
        status: 200,
        body: {
          mode: mode.mode,
          resume_offset_bytes: mode.resumeOffsetBytes
        }
      };
    }
  };
}
