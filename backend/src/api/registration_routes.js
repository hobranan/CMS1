import { createRegistrationController } from "./registration_controller.js";
import { createAuthController } from "./auth_controller.js";
import { createLoginRoutes } from "./login_routes.js";
import { CredentialStoreRepository } from "../models/credential_store_repository.js";
import { LockoutStateRepository } from "../models/lockout_state_repository.js";
import { LoginAttemptRepository } from "../models/login_attempt_repository.js";
import { SessionService } from "../services/auth/session_service.js";
import { LoginObservabilityService } from "../services/auth/login_observability_service.js";
import { CredentialRepository } from "../models/credential_repository.js";
import { PasswordHistoryRepository } from "../models/password_history_repository.js";
import { PasswordChangeObservabilityService } from "../services/account/password_change_observability_service.js";
import { createPasswordChangeRoutes } from "./password_change_routes.js";
import { PaperSubmissionRepository } from "../models/paper-submission.js";
import { SubmissionPersistenceService } from "../services/submissions/submission-persistence-service.js";
import { SubmissionObservabilityService } from "../services/submissions/submission-observability-service.js";
import { createSubmissionRoutes } from "./submissions/routes.js";
import { UploadAttemptRepository } from "../models/upload-attempt.js";
import { UploadProgressStateRepository } from "../models/upload-progress-state.js";
import { FileAttachmentRecordRepository } from "../models/file-attachment-record.js";
import { UploadTransferService } from "../services/uploads/upload-transfer-service.js";
import { AttachmentAssociationService } from "../services/uploads/attachment-association-service.js";
import { UploadObservabilityService } from "../services/uploads/upload-observability-service.js";
import { createUploadRoutes } from "./uploads/routes.js";
import { SubmissionDraftRepository } from "../models/submission-draft.js";
import { SaveAttemptRepository } from "../models/save-attempt.js";
import { DraftPersistenceService } from "../services/drafts/draft-persistence-service.js";
import { FinalizeOrderingObservabilityService } from "../services/drafts/finalize-ordering-observability-service.js";
import { createDraftRoutes } from "./drafts/routes.js";

export function createRegistrationRoutes(deps) {
  if (!deps.credentialStoreRepository) {
    deps.credentialStoreRepository = new CredentialStoreRepository(deps.repository);
  }
  if (!deps.lockoutStateRepository) {
    deps.lockoutStateRepository = new LockoutStateRepository();
  }
  if (!deps.loginAttemptRepository) {
    deps.loginAttemptRepository = new LoginAttemptRepository();
  }
  if (!deps.sessionService) {
    deps.sessionService = new SessionService();
  }
  if (!deps.loginObservabilityService) {
    deps.loginObservabilityService = new LoginObservabilityService();
  }
  if (!deps.credentialRepository) {
    deps.credentialRepository = new CredentialRepository(deps.repository);
  }
  if (!deps.passwordHistoryRepository) {
    deps.passwordHistoryRepository = new PasswordHistoryRepository();
  }
  if (!deps.passwordChangeObservabilityService) {
    deps.passwordChangeObservabilityService = new PasswordChangeObservabilityService();
  }
  if (!deps.paperSubmissionRepository) {
    deps.paperSubmissionRepository = new PaperSubmissionRepository();
  }
  if (!deps.submissionPersistenceService) {
    deps.submissionPersistenceService = new SubmissionPersistenceService(deps.paperSubmissionRepository);
  }
  if (!deps.submissionObservabilityService) {
    deps.submissionObservabilityService = new SubmissionObservabilityService();
  }
  if (!deps.uploadAttemptRepository) {
    deps.uploadAttemptRepository = new UploadAttemptRepository();
  }
  if (!deps.uploadProgressStateRepository) {
    deps.uploadProgressStateRepository = new UploadProgressStateRepository();
  }
  if (!deps.fileAttachmentRecordRepository) {
    deps.fileAttachmentRecordRepository = new FileAttachmentRecordRepository();
  }
  if (!deps.uploadTransferService) {
    deps.uploadTransferService = new UploadTransferService();
  }
  if (!deps.attachmentAssociationService) {
    deps.attachmentAssociationService = new AttachmentAssociationService();
  }
  if (!deps.uploadObservabilityService) {
    deps.uploadObservabilityService = new UploadObservabilityService();
  }
  if (!deps.submissionDraftRepository) {
    deps.submissionDraftRepository = new SubmissionDraftRepository();
  }
  if (!deps.saveAttemptRepository) {
    deps.saveAttemptRepository = new SaveAttemptRepository();
  }
  if (!deps.draftPersistenceService) {
    deps.draftPersistenceService = new DraftPersistenceService(deps.submissionDraftRepository);
  }
  if (!deps.finalizeOrderingObservabilityService) {
    deps.finalizeOrderingObservabilityService = new FinalizeOrderingObservabilityService();
  }

  const registrationController = createRegistrationController(deps);
  const authController = createAuthController(deps);
  const loginRoutes = createLoginRoutes(deps);
  const passwordChangeRoutes = createPasswordChangeRoutes(deps);
  const submissionRoutes = createSubmissionRoutes(deps);
  const uploadRoutes = createUploadRoutes(deps);
  const draftRoutes = createDraftRoutes(deps);

  return {
    "/api/v1/registrations:POST": registrationController.submitRegistration,
    "/api/v1/registrations/verify:GET": registrationController.verifyRegistration,
    "/api/v1/registrations/resend-confirmation:POST": registrationController.resendConfirmation,
    "/api/v1/auth/login:POST": authController.login,
    ...loginRoutes,
    ...passwordChangeRoutes,
    ...submissionRoutes,
    ...uploadRoutes,
    ...draftRoutes
  };
}
