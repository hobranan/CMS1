import test from "node:test";
import assert from "node:assert/strict";

import { loadRegistrationPrices } from "../../frontend/src/controllers/public-pricing/registration-prices-controller.js";
import { registrationPricesErrorMessage } from "../../frontend/src/controllers/public-pricing/registration-prices-error-controller.js";
import { loadPublicSchedule } from "../../frontend/src/controllers/public-schedule/public-schedule-controller.js";
import { loadPublicEntryDetail } from "../../frontend/src/controllers/public-schedule/public-schedule-detail-controller.js";
import { publicScheduleErrorMessage } from "../../frontend/src/controllers/public-schedule/public-schedule-error-feedback-controller.js";
import { loadSchedulePdf } from "../../frontend/src/controllers/public-schedule/public-schedule-pdf-controller.js";
import { mapAnonymizedReviewDetail } from "../../frontend/src/controllers/review-view/anonymized-review-detail-controller.js";
import { loadCompletedReviews, loadCompletedReviewDetail } from "../../frontend/src/controllers/review-view/anonymized-review-view-controller.js";
import { mapReviewOpenFailure } from "../../frontend/src/controllers/review-view/review-open-failure-controller.js";
import { loadReviewDraft, submitReview, reviewFormReadOnlyState } from "../../frontend/src/controllers/reviews/review-submit-controller.js";
import { loadEditableSchedule, saveEditableSchedule, cancelScheduleEdit } from "../../frontend/src/controllers/schedule-edit/schedule-edit-controller.js";
import { scheduleEditErrorFeedback } from "../../frontend/src/controllers/schedule-edit/schedule-edit-error-feedback-controller.js";
import { scheduleEditSaveFeedback } from "../../frontend/src/controllers/schedule-edit/schedule-edit-save-feedback-controller.js";
import { generateSchedule } from "../../frontend/src/controllers/schedule/schedule-draft-controller.js";
import { scheduleErrorMessage } from "../../frontend/src/controllers/schedule/schedule-error-feedback-controller.js";
import { publishScheduleDraft } from "../../frontend/src/controllers/schedule/schedule-publish-controller.js";
import { submissionErrorMessage } from "../../frontend/src/controllers/submission/submission-error-controller.js";
import { submitManuscript } from "../../frontend/src/controllers/submission/submission-form-controller.js";
import { buildAccountTicketLink } from "../../frontend/src/controllers/tickets/account-ticket-controller.js";
import { buildRegistrationTicketViewModel } from "../../frontend/src/controllers/tickets/registration-ticket-controller.js";
import { buildTicketConfirmationMessage } from "../../frontend/src/controllers/tickets/ticket-confirmation-controller.js";
import { buildTicketOutcomeFeedback } from "../../frontend/src/controllers/tickets/ticket-outcome-feedback-controller.js";
import { getUploadRetryMessage } from "../../frontend/src/controllers/upload/upload-error-controller.js";
import { assignReferee } from "../../frontend/src/controllers/workload/workload-assignment-controller.js";
import { workloadFailureMessage } from "../../frontend/src/controllers/workload/workload-failure-controller.js";
import { toDecisionViewModel } from "../../frontend/src/models/decision-notification/decision-view-model.js";
import { hydrateDraftState } from "../../frontend/src/models/draft-editor-state.js";
import { toRefereeWorkloadViewModel } from "../../frontend/src/models/referee-workload-view-model.js";
import { toValidationModel } from "../../frontend/src/models/validation_result_model.js";
import { assignedAccessErrorMessage } from "../../frontend/src/views/assigned-access-errors.js";
import { assignedAccessStateFeedback } from "../../frontend/src/views/assigned-access-state-feedback.js";
import { draftSaveFeedback } from "../../frontend/src/views/draft-save-feedback.js";
import { renderAllErrors } from "../../frontend/src/views/form_validation_errors_view.js";
import { invitationStateFeedback } from "../../frontend/src/views/invitation-state-feedback.js";
import { renderLoginErrorState } from "../../frontend/src/views/login_error_state_view.js";
import { renderRequiredFieldMessage } from "../../frontend/src/views/login_validation_view.js";
import { renderUploadValidationMessage } from "../../frontend/src/views/manuscript-upload-errors.js";
import { renderPostPasswordChangeState } from "../../frontend/src/views/password_change_post_success_view.js";
import { renderPasswordChangeValidation } from "../../frontend/src/views/password_change_validation_view.js";
import { renderPasswordChangeResult } from "../../frontend/src/views/password_change_view.js";
import { renderAssignmentErrors } from "../../frontend/src/views/referee-assignment-errors.js";
import { renderReviewSubmitErrors } from "../../frontend/src/views/review-submit-errors.js";
import { reviewViewFeedbackMessage } from "../../frontend/src/views/review-view-state-feedback.js";
import { renderSubmissionErrors } from "../../frontend/src/views/submission-form-errors.js";
import { renderVerificationState } from "../../frontend/src/views/verification_view.js";

test("wave9 covers non-app frontend controllers/models/views", async () => {
  const calls = [];
  const apiClient = async (route, options) => {
    calls.push({ route, options });
    return { status: 200, body: { status: "ok" } };
  };
  const user = { id: "u1", email: "u@example.com", role: "editor" };

  await loadRegistrationPrices(apiClient);
  assert.equal(registrationPricesErrorMessage({ status: 404 }).includes("not published"), true);
  assert.equal(registrationPricesErrorMessage({ status: 500 }).includes("temporarily"), true);
  assert.equal(registrationPricesErrorMessage({ status: 200 }), "");

  await loadPublicSchedule(apiClient, "c1");
  await loadPublicEntryDetail(apiClient, "c1", "e1");
  assert.equal(publicScheduleErrorMessage({ status: 404 }).length > 0, true);
  assert.equal(publicScheduleErrorMessage({ status: 500 }).length > 0, true);
  assert.equal(publicScheduleErrorMessage({ status: 200 }), "");
  await loadSchedulePdf(apiClient, "c1");
  await loadSchedulePdf(apiClient, "c1", "attachment");

  assert.equal(mapAnonymizedReviewDetail({ status: 404 }), null);
  assert.equal(
    mapAnonymizedReviewDetail({ status: 200, body: { reviewId: "r1", identityRemoved: true, recommendation: "accept", comments: "ok", fields: {} } }).reviewId,
    "r1"
  );
  await loadCompletedReviews(apiClient, "p1", user);
  await loadCompletedReviewDetail(apiClient, "p1", "r1", user);
  assert.equal(mapReviewOpenFailure({ status: 404 }).includes("no longer"), true);
  assert.equal(mapReviewOpenFailure({ status: 403 }).includes("not allowed"), true);
  assert.equal(mapReviewOpenFailure({ status: 500 }).includes("Unable"), true);

  await loadReviewDraft(apiClient, "a1", user);
  await submitReview(apiClient, "a1", { recommendation: "ACCEPT" }, user);
  assert.equal(reviewFormReadOnlyState({ status: 200, body: { status: "submitted" } }), true);
  assert.equal(reviewFormReadOnlyState({ status: 200, body: { status: "draft" } }), false);

  await loadEditableSchedule(apiClient, "c1", user);
  await saveEditableSchedule(apiClient, "c1", { expectedVersion: 1 }, user);
  await cancelScheduleEdit(apiClient, "c1", user);
  assert.equal(scheduleEditErrorFeedback({ status: 423 }).includes("locked"), true);
  assert.equal(scheduleEditErrorFeedback({ status: 409 }).includes("Reload"), true);
  assert.equal(scheduleEditErrorFeedback({ status: 400, body: { message: "bad" } }), "bad");
  assert.equal(scheduleEditErrorFeedback({ status: 500 }).includes("failed"), true);
  assert.equal(scheduleEditErrorFeedback({ status: 200 }), "");
  assert.equal(scheduleEditSaveFeedback({ status: 200 }).includes("saved"), true);
  assert.equal(scheduleEditSaveFeedback({ status: 500 }).includes("failed"), true);

  await generateSchedule(apiClient, "c1", { seed: 1 }, user);
  assert.equal(scheduleErrorMessage({ status: 400, body: { message: "invalid" } }), "invalid");
  assert.equal(scheduleErrorMessage({ status: 500 }).includes("failed"), true);
  assert.equal(scheduleErrorMessage({ status: 200 }), "");
  await publishScheduleDraft(apiClient, "c1", "d1", { confirm: true }, user);

  assert.equal(submissionErrorMessage({ status: 503 }).includes("Temporary"), true);
  assert.equal(submissionErrorMessage({ status: 400 }).includes("errors"), true);
  assert.equal(submissionErrorMessage({ status: 409 }).includes("interrupted"), true);
  await submitManuscript(apiClient, { manuscript_file: { fileName: "paper.pdf" } }, user);

  assert.equal(buildAccountTicketLink("reg-1").includes("/reg-1/ticket.pdf"), true);
  assert.equal(buildRegistrationTicketViewModel({ ticketReference: "T-1", qrCodePresent: 1 }).format, "pdf");
  assert.equal(buildRegistrationTicketViewModel({ ticketReference: "T-1", qrCodePresent: 0, format: "png" }).format, "png");
  assert.equal(buildTicketConfirmationMessage("T-1").includes("T-1"), true);
  assert.equal(buildTicketOutcomeFeedback("PAYMENT_PENDING_OR_UNRESOLVED").includes("pending"), true);
  assert.equal(buildTicketOutcomeFeedback("TICKET_STORAGE_FAILED").includes("storage"), true);
  assert.equal(buildTicketOutcomeFeedback("OTHER").includes("failed"), true);
  assert.equal(getUploadRetryMessage({ status: 503 }).includes("Retry"), true);
  assert.equal(getUploadRetryMessage({ status: 409 }).includes("not attached"), true);
  assert.equal(getUploadRetryMessage({ status: 400 }).includes("failed"), true);

  await assignReferee(apiClient, "p1", "r1", user, { trackId: "AI", role: "reviewer", selectionSnapshot: { at: "x" } });
  assert.equal(workloadFailureMessage({ status: 503 }).includes("temporarily"), true);
  assert.equal(workloadFailureMessage({ status: 400 }).includes("failed"), true);

  assert.equal(toDecisionViewModel({ body: { paperId: "p1", decisionStatus: "accept" } }).sourceOfTruth, "cms");
  assert.deepEqual(hydrateDraftState({ body: { editable_state: { title: "x" } } }), { title: "x" });
  assert.deepEqual(hydrateDraftState({}), {});
  assert.equal(toRefereeWorkloadViewModel({ status: 500 }), null);
  assert.equal(toRefereeWorkloadViewModel({ status: 200, body: { referee_id: "r1", current_workload: 2, applicable_limit: 3 } }).refereeId, "r1");
  assert.equal(toValidationModel({ status: 200, body: {} }).ok, true);
  assert.equal(toValidationModel({ status: 422, body: { errors: [{ field: "x" }] } }).errors.length, 1);

  assert.equal(assignedAccessErrorMessage({ status: 404, body: { message: "gone" } }), "gone");
  assert.equal(assignedAccessErrorMessage({ status: 500 }).includes("System error"), true);
  assert.equal(assignedAccessErrorMessage({ status: 200 }), "");
  assert.equal(assignedAccessStateFeedback({ status: 200, body: { papers: [] } }).includes("No assigned"), true);
  assert.equal(assignedAccessStateFeedback({ status: 403 }).includes("not authorized"), true);
  assert.equal(assignedAccessStateFeedback({ status: 200, body: { papers: [1] } }), "");
  assert.equal(draftSaveFeedback({ body: { status: "SAVED" } }).includes("saved"), true);
  assert.equal(draftSaveFeedback({ body: { status: "NO_CHANGES" } }).includes("No new"), true);
  assert.equal(draftSaveFeedback({ body: { status: "VALIDATION_FAILED" } }).includes("validation"), true);
  assert.equal(draftSaveFeedback({ body: { status: "OTHER" } }).includes("failed"), true);
  assert.deepEqual(renderAllErrors([{ field: "x", message: "m" }]), ["x: m"]);
  assert.equal(invitationStateFeedback({ status: 200, body: { invitations: [] } }).includes("No pending"), true);
  assert.equal(invitationStateFeedback({ status: 400, body: { message: "blocked" } }), "blocked");
  assert.equal(invitationStateFeedback({ status: 409 }).includes("Refresh"), true);
  assert.equal(invitationStateFeedback({ status: 200, body: { invitations: [1] } }), "");
  assert.equal(renderLoginErrorState({ status: 423 }).includes("locked"), true);
  assert.equal(renderLoginErrorState({ status: 503 }).includes("System"), true);
  assert.equal(renderLoginErrorState({ status: 401 }).includes("Invalid"), true);
  assert.equal(renderLoginErrorState({ status: 400 }).includes("failed"), true);
  assert.equal(renderRequiredFieldMessage([]), "");
  assert.equal(renderRequiredFieldMessage([{ field: "email" }]).includes("required"), true);
  assert.equal(renderUploadValidationMessage().includes("Allowed formats"), true);
  assert.equal(renderPostPasswordChangeState({ status: 200 }).includes("signed out"), true);
  assert.equal(renderPostPasswordChangeState({ status: 500 }), "");
  assert.equal(renderPasswordChangeValidation([]), "");
  assert.equal(renderPasswordChangeValidation([{ field: "p", message: "bad" }]).includes("p: bad"), true);
  assert.equal(renderPasswordChangeResult({ status: 200 }).includes("successfully"), true);
  assert.equal(renderPasswordChangeResult({ status: 400 }).includes("correct"), true);
  assert.equal(renderPasswordChangeResult({ status: 503 }).includes("retry later"), true);
  assert.equal(renderPasswordChangeResult({ status: 500 }).includes("failed"), true);
  assert.deepEqual(renderAssignmentErrors({ status: 500, body: {} }), []);
  assert.deepEqual(renderAssignmentErrors({ status: 400, body: { errors: [{ field: "x" }] } }), [{ field: "x" }]);
  assert.deepEqual(renderReviewSubmitErrors({ status: 500, body: {} }), []);
  assert.deepEqual(renderReviewSubmitErrors({ status: 400, body: { errors: [{ field: "x" }] } }), [{ field: "x" }]);
  assert.equal(reviewViewFeedbackMessage({ status: 200, body: { reviews: [] } }).includes("No completed"), true);
  assert.equal(reviewViewFeedbackMessage({ status: 403 }).includes("not allowed"), true);
  assert.equal(reviewViewFeedbackMessage({ status: 500 }).includes("could not"), true);
  assert.equal(reviewViewFeedbackMessage({ status: 200, body: { reviews: [1] } }), "");
  assert.deepEqual(renderSubmissionErrors([{ field: "x", message: "m" }]), ["x: m"]);
  assert.equal(renderVerificationState({ status: 200 }).includes("verified"), true);
  assert.equal(renderVerificationState({ status: 410 }).includes("expired"), true);
  assert.equal(renderVerificationState({ status: 500 }).includes("failed"), true);

  assert.ok(calls.length > 10);
});
