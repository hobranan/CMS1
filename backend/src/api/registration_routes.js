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
import { createAssignmentRoutes } from "./assignments/routes.js";
import { PaperRefereeAssignmentRepository } from "../models/paper-referee-assignment.js";
import { ReviewInvitationService } from "../services/assignments/review-invitation-service.js";
import { AssignmentObservabilityService } from "../services/assignments/assignment-observability-service.js";
import { createWorkloadRoutes } from "./workload/routes.js";
import { WorkloadLimitRuleRepository } from "../models/workload-limit-rule.js";
import { PaperAssignmentAttemptRepository } from "../models/paper-assignment-attempt.js";
import { RefereeWorkloadRetrievalService } from "../services/workload/referee-workload-retrieval-service.js";
import { WorkloadAssignmentPersistenceService } from "../services/workload/workload-assignment-persistence-service.js";
import { WorkloadRuleObservabilityService } from "../services/workload/workload-rule-observability-service.js";
import { createInvitationRoutes } from "./invitations/routes.js";
import { ReviewInvitationRepository } from "../models/review-invitation.js";
import { InvitationResponseRepository } from "../models/invitation-response.js";
import { ReviewAssignmentActivationRepository } from "../models/review-assignment-activation.js";
import { InvitationResponsePersistenceService } from "../services/invitations/invitation-response-persistence-service.js";
import { InvitationNotificationService } from "../services/invitations/invitation-notification-service.js";
import { InvitationNotificationObservabilityService } from "../services/invitations/invitation-notification-observability-service.js";
import { createAssignedAccessRoutes } from "./assigned-access/routes.js";
import { AssignedPaperRepository } from "../models/assigned-paper.js";
import { createReviewRoutes } from "./reviews/routes.js";
import { createReviewViewRoutes } from "./review-view/routes.js";
import { ReviewSubmissionRepository } from "../models/review-draft.js";
import { ReviewNotificationService } from "../services/reviews/review-notification-service.js";
import { ReviewSubmissionObservabilityService } from "../services/reviews/review-submission-observability-service.js";
import { createDecisionRoutes } from "./decisions/routes.js";
import { PaperDecisionRepository } from "../models/decision-record.js";
import { PaperDecisionNotificationService } from "../services/decisions/paper-decision-notification-service.js";
import { PaperDecisionObservabilityService } from "../services/paper-decision/paper-decision-observability-service.js";
import { createDecisionNotificationRoutes } from "./decision-notification/routes.js";
import { createScheduleRoutes } from "./schedule/routes.js";
import { ScheduleDraftRepository } from "../models/schedule-draft.js";
import { ScheduleGenerationObservabilityService } from "../services/schedule/schedule-generation-observability-service.js";
import { applyRoomAvailability } from "../services/schedule/room-availability-service.js";
import { createScheduleEditRoutes } from "./schedule-edit/routes.js";
import { ScheduleEditObservabilityService } from "../services/schedule-edit/schedule-edit-observability-service.js";
import { createPublicScheduleRoutes } from "./public-schedule/routes.js";
import { PublicScheduleObservabilityService } from "../services/public-schedule/public-schedule-observability-service.js";
import { createPublicPricingRoutes } from "./public-pricing/routes.js";
import { PublicPricingObservabilityService } from "../services/public-pricing/public-pricing-observability-service.js";
import { createPaymentRoutes } from "./payments/routes.js";
import { PaymentWorkflowStore } from "../models/payment-workflow-store.js";
import { PaymentObservabilityService } from "../services/payments/payment-observability-service.js";

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
  if (!deps.paperRefereeAssignmentRepository) {
    deps.paperRefereeAssignmentRepository = new PaperRefereeAssignmentRepository();
  }
  if (!deps.reviewInvitationService) {
    deps.reviewInvitationService = new ReviewInvitationService();
  }
  if (!deps.assignmentObservabilityService) {
    deps.assignmentObservabilityService = new AssignmentObservabilityService();
  }
  if (!deps.workloadLimitRuleRepository) {
    deps.workloadLimitRuleRepository = new WorkloadLimitRuleRepository();
  }
  if (!deps.paperAssignmentAttemptRepository) {
    deps.paperAssignmentAttemptRepository = new PaperAssignmentAttemptRepository();
  }
  if (!deps.refereeWorkloadRetrievalService) {
    deps.refereeWorkloadRetrievalService = new RefereeWorkloadRetrievalService();
  }
  if (!deps.workloadAssignmentPersistenceService) {
    deps.workloadAssignmentPersistenceService = new WorkloadAssignmentPersistenceService();
  }
  if (!deps.workloadRuleObservabilityService) {
    deps.workloadRuleObservabilityService = new WorkloadRuleObservabilityService();
  }
  if (!deps.reviewInvitationRepository) {
    deps.reviewInvitationRepository = new ReviewInvitationRepository();
  }
  if (!deps.invitationResponseRepository) {
    deps.invitationResponseRepository = new InvitationResponseRepository();
  }
  if (!deps.reviewAssignmentActivationRepository) {
    deps.reviewAssignmentActivationRepository = new ReviewAssignmentActivationRepository();
  }
  if (!deps.invitationResponsePersistenceService) {
    deps.invitationResponsePersistenceService = new InvitationResponsePersistenceService(
      deps.reviewInvitationRepository,
      deps.invitationResponseRepository,
      deps.reviewAssignmentActivationRepository
    );
  }
  if (!deps.invitationNotificationService) {
    deps.invitationNotificationService = new InvitationNotificationService();
  }
  if (!deps.invitationNotificationObservabilityService) {
    deps.invitationNotificationObservabilityService = new InvitationNotificationObservabilityService();
  }
  if (!deps.assignedPaperRepository) {
    deps.assignedPaperRepository = new AssignedPaperRepository();
  }
  if (!deps.reviewSubmissionRepository) {
    deps.reviewSubmissionRepository = new ReviewSubmissionRepository();
  }
  if (!deps.reviewNotificationService) {
    deps.reviewNotificationService = new ReviewNotificationService();
  }
  if (!deps.reviewSubmissionObservabilityService) {
    deps.reviewSubmissionObservabilityService = new ReviewSubmissionObservabilityService();
  }
  if (!deps.paperDecisionRepository) {
    deps.paperDecisionRepository = new PaperDecisionRepository();
  }
  if (!deps.paperDecisionNotificationService) {
    deps.paperDecisionNotificationService = new PaperDecisionNotificationService();
  }
  if (!deps.paperDecisionObservabilityService) {
    deps.paperDecisionObservabilityService = new PaperDecisionObservabilityService();
  }
  if (!deps.scheduleDraftRepository) {
    deps.scheduleDraftRepository = new ScheduleDraftRepository();
  }
  if (!deps.scheduleGenerationObservabilityService) {
    deps.scheduleGenerationObservabilityService = new ScheduleGenerationObservabilityService();
  }
  if (!deps.roomAvailabilityService) {
    deps.roomAvailabilityService = applyRoomAvailability;
  }
  if (!deps.scheduleEditVersions) {
    deps.scheduleEditVersions = new Map();
  }
  if (!deps.scheduleEditObservabilityService) {
    deps.scheduleEditObservabilityService = new ScheduleEditObservabilityService();
  }
  if (!deps.publicScheduleObservabilityService) {
    deps.publicScheduleObservabilityService = new PublicScheduleObservabilityService();
  }
  if (!deps.publicPricingObservabilityService) {
    deps.publicPricingObservabilityService = new PublicPricingObservabilityService();
  }
  if (!deps.paymentWorkflowStore) {
    deps.paymentWorkflowStore = new PaymentWorkflowStore();
  }
  if (!deps.paymentObservabilityService) {
    deps.paymentObservabilityService = new PaymentObservabilityService();
  }

  const registrationController = createRegistrationController(deps);
  const authController = createAuthController(deps);
  const loginRoutes = createLoginRoutes(deps);
  const passwordChangeRoutes = createPasswordChangeRoutes(deps);
  const submissionRoutes = createSubmissionRoutes(deps);
  const uploadRoutes = createUploadRoutes(deps);
  const draftRoutes = createDraftRoutes(deps);
  const assignmentRoutes = createAssignmentRoutes(deps);
  const workloadRoutes = createWorkloadRoutes(deps);
  const invitationRoutes = createInvitationRoutes(deps);
  const assignedAccessRoutes = createAssignedAccessRoutes(deps);
  const reviewRoutes = createReviewRoutes(deps);
  const reviewViewRoutes = createReviewViewRoutes(deps);
  const decisionRoutes = createDecisionRoutes(deps);
  const decisionNotificationRoutes = createDecisionNotificationRoutes(deps);
  const scheduleRoutes = createScheduleRoutes(deps);
  const scheduleEditRoutes = createScheduleEditRoutes(deps);
  const publicScheduleRoutes = createPublicScheduleRoutes(deps);
  const publicPricingRoutes = createPublicPricingRoutes(deps);
  const paymentRoutes = createPaymentRoutes(deps);

  return {
    "/api/v1/registrations:POST": registrationController.submitRegistration,
    "/api/v1/registrations/verify:GET": registrationController.verifyRegistration,
    "/api/v1/registrations/resend-confirmation:POST": registrationController.resendConfirmation,
    "/api/v1/auth/login:POST": authController.login,
    ...loginRoutes,
    ...passwordChangeRoutes,
    ...submissionRoutes,
    ...uploadRoutes,
    ...draftRoutes,
    ...assignmentRoutes,
    ...workloadRoutes,
    ...invitationRoutes,
    ...assignedAccessRoutes,
    ...reviewRoutes,
    ...reviewViewRoutes,
    ...decisionRoutes,
    ...decisionNotificationRoutes,
    ...scheduleRoutes,
    ...scheduleEditRoutes,
    ...publicScheduleRoutes,
    ...publicPricingRoutes,
    ...paymentRoutes
  };
}


