import test from "node:test";
import assert from "node:assert/strict";

import { mapAssignmentValidation } from "../../backend/src/api/assignments/assignment-error-mapper.js";
import { mapAssignmentFailure } from "../../backend/src/api/assignments/assignment-failure-response-mapper.js";
import { mapPaperDecisionError } from "../../backend/src/api/decisions/paper-decision-error-mapper.js";
import { mapPublicPricingError } from "../../backend/src/api/public-pricing/public-pricing-error-mapper.js";
import { mapPublicScheduleError } from "../../backend/src/api/public-schedule/public-schedule-error-mapper.js";
import { mapReviewViewAuthorizationError } from "../../backend/src/api/review-view/review-view-authorization-error-mapper.js";
import { mapReviewViewFailure } from "../../backend/src/api/review-view/review-view-failure-mapper.js";
import { mapScheduleError } from "../../backend/src/api/schedule/schedule-error-mapper.js";
import { interruptionResponse, storageFailure, validationFailure } from "../../backend/src/api/submissions/submission-error-mapper.js";
import { mapSubmissionList, mapSubmissionSuccess } from "../../backend/src/api/submissions/submission-response-mapper.js";
import { mapUploadValidationError } from "../../backend/src/api/uploads/upload-error-mapper.js";
import { mapUploadSuccess } from "../../backend/src/api/uploads/upload-response-mapper.js";
import { createPostSubmitReviewController } from "../../backend/src/api/reviews/post-submit-review-controller.js";
import { AssignedPaperRepository } from "../../backend/src/models/assigned-paper.js";
import { toConferenceScheduleState } from "../../backend/src/models/conference-schedule-state.js";
import { PaperDecisionRepository } from "../../backend/src/models/decision-record.js";
import { PaymentWorkflowStore } from "../../backend/src/models/payment-workflow-store.js";
import { PaperRefereeAssignmentRepository } from "../../backend/src/models/paper-referee-assignment.js";
import { asPricingAvailabilityState } from "../../backend/src/models/pricing-availability-state.js";
import { asPublicScheduleAvailability } from "../../backend/src/models/public-schedule-availability.js";
import { asPublishedPricingSet } from "../../backend/src/models/published-pricing-set.js";
import { asRegistrationPriceCategory } from "../../backend/src/models/registration-price-category.js";
import { asReviewVersionLink } from "../../backend/src/models/review-version-link.js";
import { canEditSchedule } from "../../backend/src/models/schedule-edit-access.js";
import { startEditSession } from "../../backend/src/models/schedule-edit-session.js";
import { validateScheduleGenerationRequest } from "../../backend/src/models/schedule-generation-request.js";
import { buildScheduleGrid } from "../../backend/src/models/schedule-grid.js";
import { createSessionPlacement } from "../../backend/src/models/session-placement.js";
import { asTicketDeliveryOutcome } from "../../backend/src/models/ticket-delivery-outcome.js";
import { asTicketRetrievalAccess } from "../../backend/src/models/ticket-retrieval-access.js";
import { loadPublicationState } from "../../backend/src/services/public-schedule/publication-state-service.js";
import { getVersionLinkForSubmission } from "../../backend/src/services/reviews/review-version-linking-service.js";
import { allowPublishedScheduleEdit } from "../../backend/src/services/schedule-edit/published-edit-policy-service.js";
import { validateFileConstraints } from "../../backend/src/services/submissions/file-constraint-service.js";
import { validateNewPassword } from "../../backend/src/services/security/password_policy_validator.js";
import { processPaperDecision } from "../../backend/src/services/decisions/process-paper-decision-service.js";
import { validateReviewSubmission } from "../../backend/src/services/reviews/review-submission-validation-service.js";
import { getRequiredFields } from "../../backend/src/services/validation/required_field_metadata_service.js";
import { VALIDATION_CONFIG } from "../../backend/src/models/config/validation_config.js";

test("wave7 covers tiny backend mapper/model/service modules", () => {
  assert.equal(mapAssignmentValidation([{ code: "X" }]).status, 400);
  assert.equal(mapAssignmentFailure(503, "FAIL", "x").status, 503);
  assert.equal(mapPaperDecisionError(409, "ALREADY", "done").status, 409);
  assert.equal(mapPublicPricingError({ status: 404 }).status, 404);
  assert.equal(mapPublicScheduleError({ status: 500 }).status, 500);
  assert.equal(mapReviewViewAuthorizationError().status, 403);
  assert.equal(mapReviewViewFailure().status, 500);
  assert.equal(mapScheduleError({ status: 422 }).status, 422);
  assert.equal(mapScheduleError(null).status, 500);

  assert.equal(validationFailure([{ field: "a" }]).status, 400);
  assert.equal(storageFailure().status, 503);
  assert.equal(interruptionResponse("s1").body.status, "UPLOAD_INTERRUPTED");
  assert.equal(mapSubmissionSuccess({ id: "s1" }).status, 201);
  assert.equal(
    mapSubmissionList([{ id: "s1", status: "draft", metadata: {}, manuscriptFile: { fileName: "a.pdf", contentType: "application/pdf", sizeBytes: 10 } }]).status,
    200
  );

  assert.equal(mapUploadValidationError([{ field: "file" }]).status, 400);
  assert.equal(mapUploadSuccess("s-1").status, 201);

  assert.equal(toConferenceScheduleState({ conferenceId: "c1", status: "draft" }).lastEditedAt, null);
  assert.equal(VALIDATION_CONFIG.codes.validationFailed, "VALIDATION_FAILED");
  assert.equal(asPricingAvailabilityState({}).published, true);
  assert.equal(asPublicScheduleAvailability(null).unavailableReason, "not_published");
  assert.equal(asPublishedPricingSet({ conferenceId: "c1", status: "published", categories: [{ categoryId: "x", categoryName: "A", finalAmountCad: 10 }] }).currency, "CAD");
  assert.equal(asRegistrationPriceCategory({ categoryId: "id", categoryName: "name", finalAmountCad: 1, complete: false }).complete, false);
  assert.equal(asReviewVersionLink("r1", "r2").nextReviewId, "r2");
  assert.equal(canEditSchedule({ userRole: "viewer", isLocked: false }).status, 403);
  assert.equal(startEditSession({ conferenceId: "c1", baseVersion: 1, userId: "u1" }).status, "editing");
  assert.equal(validateScheduleGenerationRequest({ conferenceId: "c1", seed: 7, requestedBy: "u1" }).seed, 7);
  assert.equal(buildScheduleGrid({ rooms: [{ roomId: "r1", roomName: "A" }], parameters: {} }).totalSlots, 4);
  assert.equal(createSessionPlacement({ paperId: "p", roomId: "r", slotIndex: 0, randomRank: 1 }).roomId, "r");
  assert.equal(asTicketDeliveryOutcome({}).status, "not_attempted");
  assert.equal(asTicketRetrievalAccess({ registrationId: 1, attendeeId: 2, retrievalAvailable: 1 }).retrievalAvailable, true);

  const pubRepo = { getPublished() { return null; } };
  assert.equal(loadPublicationState(pubRepo, "c1").isPublished, false);
  assert.equal(getVersionLinkForSubmission({ previousReviewId: "r1", reviewId: "r2" }).nextReviewId, "r2");
  assert.equal(getVersionLinkForSubmission({ previousReviewId: null, reviewId: "r2" }), null);
  assert.equal(allowPublishedScheduleEdit({ status: "published" }), true);

  const badFile = validateFileConstraints({ fileName: "bad.exe", sizeBytes: 1 });
  assert.equal(Array.isArray(badFile.errors), true);
  assert.deepEqual(getRequiredFields("missing_form"), []);
  assert.deepEqual(getRequiredFields("profile_form"), ["firstName", "lastName", "email"]);
});

test("wave7 covers remaining missed branches in core modules", () => {
  const assigned = new AssignedPaperRepository();
  assigned.seedPaper = undefined; // keep repository raw
  assigned.failNextResourceRead();
  assert.throws(() => assigned.getManuscript("p1"), /RESOURCE_RETRIEVAL_FAILURE/);
  assigned.failNextResourceRead();
  assert.throws(() => assigned.getReviewForm("p1"), /RESOURCE_RETRIEVAL_FAILURE/);

  const reviewController = createPostSubmitReviewController({
    reviewSubmissionRepository: {
      getAssignment() {
        return { refereeId: "r1", status: "active" };
      }
    }
  });
  const reviewRes = reviewController.post({
    user: { id: "r1", role: "referee", email: "r@example.com" },
    params: { assignmentId: "a1" },
    body: {}
  });
  assert.equal(reviewRes.status, 400);

  const submissionValidation = validateReviewSubmission({
    assignment: { status: "active" },
    fields: { strengths: undefined },
    recommendation: "accept"
  });
  assert.equal(submissionValidation.status, 400);
  assert.ok(submissionValidation.errors.some((e) => e.field === "strengths"));

  const decisionRepo = new PaperDecisionRepository();
  decisionRepo.failNextDecisionRead();
  assert.throws(() => decisionRepo.getDecision("p1"), /DECISION_RETRIEVAL_FAILURE/);
  assert.throws(
    () => decisionRepo.createDecision({ paperId: "missing", editorId: "e1", outcome: "accept", now: new Date("2026-01-01T00:00:00.000Z") }),
    /PAPER_NOT_FOUND/
  );

  const pwErrors = validateNewPassword({
    newPassword: undefined,
    currentPassword: undefined,
    currentPasswordHash: null,
    recentHistoryHashes: []
  });
  assert.ok(pwErrors.length > 0);
  const equalsCurrent = validateNewPassword({
    newPassword: "SamePassword123!",
    currentPassword: "SamePassword123!",
    currentPasswordHash: null,
    recentHistoryHashes: []
  });
  assert.ok(equalsCurrent.some((e) => e.code === "NEW_EQUALS_CURRENT"));

  const store = new PaymentWorkflowStore();
  const seeded = store.seedRegistration({ registrationId: "reg-1", state: "unpaid", attendeeId: "a1" });
  assert.equal(seeded.categoryId, null);
  assert.equal(seeded.amount, 0);

  const assignRepo = new PaperRefereeAssignmentRepository();
  assignRepo.seedPaper({ paperId: "p1" });
  assignRepo.seedReferee({ refereeId: "r1" });
  assignRepo.assignments.set("p1", { paperId: "p1" });
  assignRepo.applyAssignment({ paperId: "p1", refereeIds: ["r1"], now: new Date("2026-01-01T00:00:00.000Z") });
  assignRepo.assignments.set("p1", { paperId: "p1" });
  assignRepo.restoreAssignment({ paperId: "p1", previousAssignment: { paperId: "p1" }, now: new Date("2026-01-01T00:00:00.000Z") });

  const decision = processPaperDecision(
    {
      paperDecisionRepository: {
        getPaper() {
          return { id: "p1", editorId: "e1", status: "under_review", decisionPeriodOpen: true, completedReviewCount: 1 };
        },
        getDecision() {
          return { decisionId: "already" };
        }
      },
      paperDecisionObservabilityService: { record() {} },
      paperDecisionNotificationService: { notifyAuthors() {} }
    },
    { paperId: "p1", editorId: "e1", outcome: "accept", comment: "", confirm: true, allowNoReviewsOverride: false }
  );
  assert.equal(decision.status, 409);

  const success = processPaperDecision(
    {
      paperDecisionRepository: {
        getPaper() {
          return { id: "p2", editorId: "e1", status: "under_review", decisionPeriodOpen: true, completedReviewCount: 1 };
        },
        getDecision() {
          return null;
        },
        createDecision() {
          return { decisionId: "d2" };
        }
      },
      paperDecisionNotificationService: { notifyAuthors() {} }
    },
    { paperId: "p2", editorId: "e1", outcome: "reject", comment: "", confirm: true }
  );
  assert.equal(success.status, 200);
});
