import test from "node:test";
import assert from "node:assert/strict";

import { validateRefereeEligibility } from "../../backend/src/services/assignments/referee-eligibility-validation-service.js";
import { validateLoginPayload } from "../../backend/src/services/auth/login_validation_service.js";
import { assertAuthorOwnership } from "../../backend/src/services/authorization/author-ownership-policy.js";
import { getDecisionWithFailureHandling } from "../../backend/src/services/decision-notification/get-decision-with-failure-handling.js";
import { persistPaperDecision } from "../../backend/src/services/decisions/paper-decision-persistence-service.js";
import { finalizeDraft } from "../../backend/src/services/drafts/finalize-draft-service.js";
import { saveDraft } from "../../backend/src/services/drafts/save-draft-orchestrator.js";
import { InvitationResponsePersistenceService } from "../../backend/src/services/invitations/invitation-response-persistence-service.js";
import { processInvitationResponse } from "../../backend/src/services/invitations/process-invitation-response-service.js";
import { handleNonSuccessPaymentOutcome } from "../../backend/src/services/payments/non-success-payment-outcome-service.js";
import { retrievePublicEntryDetail } from "../../backend/src/services/public-schedule/public-schedule-detail-service.js";
import { generatePublicSchedulePdf } from "../../backend/src/services/public-schedule/public-schedule-pdf-service.js";
import { retrievePublicSchedule } from "../../backend/src/services/public-schedule/public-schedule-retrieval-service.js";
import { RegistrationAuditLog } from "../../backend/src/services/registration/registration_audit_log.js";
import { verifyRegistration } from "../../backend/src/services/registration/verification_service.js";
import { validateReviewSubmission } from "../../backend/src/services/reviews/review-submission-validation-service.js";
import { processReviewSubmission } from "../../backend/src/services/reviews/process-review-submission-service.js";
import { authorizeEditorPaperAccess } from "../../backend/src/services/review-view/editor-review-authorization-service.js";
import { getCompletedReviewDetail } from "../../backend/src/services/review-view/get-completed-review-detail-service.js";
import { validateScheduleEdits } from "../../backend/src/services/schedule-edit/schedule-edit-validation-service.js";
import { validateSubmissionInput } from "../../backend/src/services/submissions/submission-validation-service.js";
import { mapTicketFailure } from "../../backend/src/services/tickets/ticket-failure-handling-service.js";
import { AttachmentAssociationService } from "../../backend/src/services/uploads/attachment-association-service.js";
import { UploadTransferService } from "../../backend/src/services/uploads/upload-transfer-service.js";
import { assignRefereeWithLimit } from "../../backend/src/services/workload/assign-referee-with-limit-service.js";
import { RefereeWorkloadRetrievalService } from "../../backend/src/services/workload/referee-workload-retrieval-service.js";
import { decideAssignment } from "../../backend/src/services/workload/workload-assignment-decision-service.js";
import { PaymentWorkflowStore } from "../../backend/src/models/payment-workflow-store.js";
import { RegistrationRepository } from "../../backend/src/models/registration_repository.js";

function createDraftDepsForFinalize() {
  let getCount = 0;
  const draft = {
    draftId: "d1",
    authorEmail: "a@example.com",
    status: "DRAFT",
    editableState: { title: "Valid title", abstract: "Valid abstract" },
    stateHash: "h",
    lastSavedAt: "2026-01-01T00:00:00.000Z"
  };

  return {
    submissionDraftRepository: {
      get() {
        getCount += 1;
        if (getCount === 1) return draft;
        return null;
      },
      update() {}
    },
    draftPersistenceService: {
      persistDraftState({ editableState, now }) {
        draft.editableState = editableState;
        draft.lastSavedAt = now.toISOString();
        return draft;
      }
    },
    saveAttemptRepository: { add() {} },
    finalizeOrderingObservabilityService: { record() {} }
  };
}

test("wave13 covers remaining backend/src/services fallback branches", () => {
  const elig = validateRefereeEligibility({ getReferee: () => null }, ["r-missing"]);
  assert.equal(elig.valid, false);

  const loginValidation = validateLoginPayload(undefined);
  assert.equal(loginValidation.errors.length > 0, true);

  assert.equal(assertAuthorOwnership({ authors: ["owner-1"] }, "owner-2").ok, false);

  const persistResult = persistPaperDecision(
    {
      getPaper: () => ({ status: "under_review" }),
      createDecision() {
        throw new Error("save failed");
      }
    },
    { paperId: "p1", editorId: "e1", outcome: "accept", comment: "c", now: new Date("2026-01-01T00:00:00.000Z") }
  );
  assert.equal(persistResult.ok, false);
  assert.equal(persistResult.code, "DECISION_SAVE_FAILURE");

  const unknownDecision = getDecisionWithFailureHandling(
    {
      paperDecisionRepository: { getPaper: () => ({ paperId: "p1" }) },
      getDecisionForPaper: () => ({ outcome: "revisit_later" })
    },
    "p1"
  );
  assert.equal(unknownDecision.decisionStatus, "under_review");

  const finalizeResult = finalizeDraft(createDraftDepsForFinalize(), {
    user: { email: "a@example.com" },
    params: { draftId: "d1" },
    body: { editable_state: { title: "Now valid", abstract: "still here" } }
  });
  assert.equal(finalizeResult.status, 409);

  const saveDraftResult = saveDraft(
    {
      submissionDraftRepository: {
        get: () => ({ draftId: "d2", authorEmail: "a@example.com", status: "DRAFT", editableState: {}, lastSavedAt: "n" })
      },
      draftPersistenceService: {
        persistDraftState() {
          throw new Error("untyped failure");
        }
      },
      saveAttemptRepository: { add() {} }
    },
    { user: { email: "a@example.com" }, params: { draftId: "d2" }, body: { editable_state: { title: "abc" } } }
  );
  assert.equal(saveDraftResult.status, 503);
  assert.equal(saveDraftResult.body.code, "SYSTEM_FAILURE");

  const invitationPersistence = new InvitationResponsePersistenceService(
    {
      update() {
        throw new Error("update failed");
      }
    },
    {
      add() {
        return { ok: true };
      },
      remove() {}
    },
    { activate() {}, deactivate() {} }
  );
  assert.throws(() => invitationPersistence.persist({ invitation: { invitationId: "i1", status: "pending", refereeId: "r1", paperId: "p1" }, decision: "accept", now: new Date() }));

  const invitationResponse = processInvitationResponse(
    {
      reviewInvitationRepository: { get: () => null },
      invitationResponsePersistenceService: { persist() {} },
      invitationNotificationService: { notifyEditor() {} },
      invitationNotificationObservabilityService: { record() {} }
    },
    { invitationId: "i2", decision: "accept", refereeId: "r1" }
  );
  assert.equal(invitationResponse.status, 400);

  const paymentStore = new PaymentWorkflowStore();
  paymentStore.seedRegistration({ registrationId: "reg1", attendeeId: "u1", state: "unpaid", amount: 100, currency: "CAD" });
  const attempt = paymentStore.createAttempt({
    attemptId: "a1",
    registrationId: "reg1",
    attendeeId: "u1",
    categoryId: "regular",
    status: "initiated",
    amount: 100,
    currency: "CAD"
  });
  const nonSuccess = handleNonSuccessPaymentOutcome(paymentStore, { attempt, gatewayStatus: "declined" });
  assert.equal(nonSuccess.outcome, "declined");

  const scheduleRepo = {
    failNextPublicEntryRead: false,
    failNextPublicPdfRead: false,
    failNextPublicScheduleRead: false,
    getPublished: () => ({ entries: undefined, conferenceId: "c1", title: "S" })
  };
  assert.equal(retrievePublicEntryDetail(scheduleRepo, "c1", "missing", {}).status, 404);
  assert.equal(generatePublicSchedulePdf(scheduleRepo, "c1").status, 200);
  assert.equal(retrievePublicSchedule(scheduleRepo, "c1").status, 200);

  const auditLog = new RegistrationAuditLog();
  auditLog.record("evt", { email: "invalid-email-no-domain" });
  assert.equal(auditLog.events[0].payload.email, "***");

  const verifyResult = verifyRegistration(
    {
      repository: new RegistrationRepository(),
      auditLog: { record() {} }
    },
    { query: {} }
  );
  assert.equal(verifyResult.status, 400);

  const reviewValidation = validateReviewSubmission({ assignment: { status: "active" }, fields: null, recommendation: "ok" });
  assert.equal(reviewValidation.ok, false);

  const reviewSubmission = processReviewSubmission(
    {
      reviewSubmissionRepository: { getAssignment: () => null },
      reviewNotificationService: { notifyEditor() {} },
      reviewSubmissionObservabilityService: { record() {} }
    },
    { assignmentId: "as1", refereeId: "r1", fields: {}, recommendation: "accept", comments: "c" }
  );
  assert.equal(reviewSubmission.status, 403);

  const paperAccess = authorizeEditorPaperAccess({ listAssignmentsByPaper: () => [] }, "e1", "p1");
  assert.equal(paperAccess.hasAssignments, false);

  const reviewDetail = getCompletedReviewDetail(
    {
      reviewSubmissionRepository: {
        getSubmittedReview: () => ({ reviewId: "rev1", assignmentId: "as1", status: "draft", submittedAt: "n", recommendation: "x", comments: "y", fields: {} }),
        getAssignment: () => ({ assignmentId: "as1", paperId: "p1", editorId: "e1" })
      }
    },
    { editorId: "e1", paperId: "p1", reviewId: "rev1" }
  );
  assert.equal(reviewDetail.outcome, "review_not_found");

  const scheduleValidation = validateScheduleEdits({ draft: {}, editPayload: {} });
  assert.equal(scheduleValidation.valid, false);

  const submissionValidation = validateSubmissionInput(undefined, null);
  assert.equal(submissionValidation.valid, false);

  assert.equal(mapTicketFailure("unknown_code").code, "TICKET_ISSUANCE_FAILED");

  const associationService = new AttachmentAssociationService();
  assert.throws(
    () => associationService.associate({
      paperSubmissionRepository: { attachManuscript: () => null },
      fileAttachmentRecordRepository: { setAttached() {} },
      submissionId: "sub1",
      file: { fileName: "doc.pdf", contentType: "application/pdf", sizeBytes: 1 },
      now: new Date()
    }),
    /Submission not found/
  );

  let checkpoint = 0;
  const transferService = new UploadTransferService();
  transferService.failNextWithInterruption();
  assert.throws(
    () => transferService.transfer({
      submissionId: "sub2",
      file: { fileName: "doc.pdf", sizeBytes: 10 },
      mode: "resume",
      resumeOffsetBytes: 0,
      onCheckpoint: (offset) => {
        checkpoint = offset;
      }
    }),
    /Upload interrupted/
  );
  assert.equal(checkpoint > 0, true);

  const workloadRetrieval = new RefereeWorkloadRetrievalService();
  workloadRetrieval.increment("new-ref");
  assert.equal(workloadRetrieval.getCurrentWorkload("new-ref"), 1);

  const assignResult = assignRefereeWithLimit(
    {
      workloadLimitRuleRepository: { resolveRule: () => ({ id: "rule-1", version: 1, source: "default", limit: 2 }) },
      refereeWorkloadRetrievalService: workloadRetrieval,
      workloadRuleObservabilityService: { record() {} },
      workloadAssignmentPersistenceService: { persist() {} },
      paperAssignmentAttemptRepository: { add() {} }
    },
    { paperId: "p1", refereeId: "new-ref", trackId: "t", role: "reviewer" }
  );
  assert.equal(assignResult.status, 200);

  const decision = decideAssignment({ currentWorkload: 1, limit: 2, selectionSnapshot: { current_workload: 1, limit: 1 } });
  assert.equal(decision.allowed, false);
});
