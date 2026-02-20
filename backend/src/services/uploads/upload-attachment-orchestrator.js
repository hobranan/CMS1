import { validateUploadCandidate } from "./upload-validation-service.js";
import { persistCheckpoint } from "./upload-progress-service.js";

export function uploadAndAttach(deps, request) {
  const now = deps.nowProvider ? deps.nowProvider() : new Date();
  const submissionId = request.params?.submissionId;
  const fileFingerprint = request.body?.file_fingerprint ?? request.file?.fileName ?? "unknown";
  if (!request.user?.email) {
    return { status: 401, body: { code: "AUTH_REQUIRED", message: "Authentication is required." } };
  }
  if (!submissionId) {
    return { status: 400, body: { code: "MISSING_SUBMISSION", message: "submissionId is required." } };
  }

  const validation = validateUploadCandidate(request.file);
  if (validation.errors.length > 0) {
    deps.fileAttachmentRecordRepository.setUnattached(submissionId);
    deps.uploadObservabilityService?.record("upload_validation_failed", { submissionId, errorCount: validation.errors.length });
    return {
      status: 400,
      body: {
        code: "UPLOAD_VALIDATION_FAILED",
        message: "Invalid manuscript file.",
        errors: validation.errors
      }
    };
  }

  const mode = request.body?.mode ?? "RESTART";
  const resumeOffsetBytes = Number(request.body?.resume_offset_bytes ?? 0);
  try {
    deps.uploadTransferService.transfer({
      submissionId,
      file: request.file,
      mode,
      resumeOffsetBytes,
      onCheckpoint: (offsetBytes) => {
        persistCheckpoint(deps.uploadProgressStateRepository, submissionId, fileFingerprint, offsetBytes, now);
      }
    });
    deps.uploadProgressStateRepository.clearCheckpoint(submissionId, fileFingerprint);
    deps.attachmentAssociationService.associate({
      paperSubmissionRepository: deps.paperSubmissionRepository,
      fileAttachmentRecordRepository: deps.fileAttachmentRecordRepository,
      submissionId,
      file: request.file,
      now
    });
    deps.uploadAttemptRepository.add({ submissionId, outcome: "SUCCESS", mode, now });
    deps.uploadObservabilityService?.record("upload_success", { submissionId, mode });
    return {
      status: 201,
      body: {
        status: "ATTACHED",
        submission_id: submissionId,
        attached: true
      }
    };
  } catch (error) {
    deps.fileAttachmentRecordRepository.setUnattached(submissionId);
    if (error.code === "UPLOAD_INTERRUPTED") {
      deps.uploadAttemptRepository.add({ submissionId, outcome: "INTERRUPTED", mode, now });
      deps.uploadObservabilityService?.record("upload_interrupted", { submissionId, mode });
      return {
        status: 503,
        body: {
          code: "UPLOAD_INTERRUPTED",
          message: "Upload interrupted. Retry once network is available.",
          attached: false
        }
      };
    }
    if (error.code === "ASSOCIATION_FAILURE") {
      deps.uploadAttemptRepository.add({ submissionId, outcome: "ASSOCIATION_FAILURE", mode, now });
      deps.uploadObservabilityService?.record("upload_association_failed", { submissionId });
      return {
        status: 409,
        body: {
          code: "ASSOCIATION_FAILED",
          message: "File uploaded but could not be attached. Retry upload.",
          attached: false
        }
      };
    }
    deps.uploadAttemptRepository.add({ submissionId, outcome: "STORAGE_FAILURE", mode, now });
    deps.uploadObservabilityService?.record("upload_storage_failed", { submissionId });
    return {
      status: 503,
      body: {
        code: "UPLOAD_STORAGE_FAILED",
        message: "Temporary storage problem. Retry later.",
        attached: false
      }
    };
  }
}
