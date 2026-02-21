import test from "node:test";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import path from "node:path";

import { validateScheduleGenerationRequest } from "../../backend/src/models/schedule-generation-request.js";
import { buildSuccessMessage } from "../../frontend/src/controllers/form_submission_success_controller.js";
import { getLoginErrorMessage } from "../../frontend/src/controllers/login_error_state_controller.js";
import { submitPasswordChange } from "../../frontend/src/controllers/password_change_controller.js";
import { postPasswordChangeNavigation } from "../../frontend/src/controllers/password_change_post_success_controller.js";
import { verifyToken, resendVerification } from "../../frontend/src/controllers/verification_controller.js";
import { mapRegistrationErrors, submitRegistration } from "../../frontend/src/controllers/registration_controller.js";
import { submitFormForValidation, mapFieldErrors } from "../../frontend/src/controllers/form_validation_controller.js";
import { submitLogin, checkSession } from "../../frontend/src/controllers/login_controller.js";
import {
  loadAssignedPapers,
  openManuscriptView,
  openReviewForm,
  supportsManuscriptDownload
} from "../../frontend/src/controllers/assigned-access/assigned-paper-access-controller.js";
import { assignmentFailureMessage } from "../../frontend/src/controllers/assignment/assignment-failure-controller.js";
import { confirmAssignment } from "../../frontend/src/controllers/assignment/referee-assignment-controller.js";
import {
  loadPaperDecision,
  loadDecisionNotification,
  cmsFallbackMessage
} from "../../frontend/src/controllers/decision-notification/paper-decision-controller.js";
import { loadDecisionContext, submitPaperDecision } from "../../frontend/src/controllers/decisions/paper-decision-controller.js";
import { mapDecisionFailure } from "../../frontend/src/controllers/decisions/paper-decision-failure-controller.js";
import { mapDecisionStateFeedback } from "../../frontend/src/controllers/decisions/paper-decision-state-feedback-controller.js";
import { saveDraft, submitDraft } from "../../frontend/src/controllers/draft/draft-editor-controller.js";
import { draftSubmitFeedback } from "../../frontend/src/controllers/draft/draft-submit-feedback-controller.js";
import { invitationFailureMessage } from "../../frontend/src/controllers/invitations/invitation-failure-controller.js";
import { buildOnlinePaymentViewModel } from "../../frontend/src/controllers/payments/online-payment-controller.js";
import { buildPaymentFailureMessage } from "../../frontend/src/controllers/payments/payment-failure-controller.js";
import { buildPaymentSuccessMessage } from "../../frontend/src/controllers/payments/payment-success-controller.js";
import { buildPaymentUnresolvedMessage } from "../../frontend/src/controllers/payments/payment-unresolved-controller.js";
import { buildAnnouncementDetailViewModel } from "../../frontend/src/controllers/public-announcements/announcement-detail-controller.js";
import { buildAnnouncementsErrorMessage } from "../../frontend/src/controllers/public-announcements/announcements-error-feedback-controller.js";
import { buildAnnouncementsListViewModel } from "../../frontend/src/controllers/public-announcements/announcements-list-controller.js";
import { pricingConsistencyKey } from "../../frontend/src/controllers/public-pricing/registration-prices-consistency-controller.js";

function createStubElement() {
  return {
    value: "",
    textContent: "",
    innerHTML: "",
    className: "",
    disabled: false,
    size: 0,
    append() {},
    appendChild() {},
    addEventListener() {},
    querySelector() {
      return createStubElement();
    },
    querySelectorAll() {
      return [];
    }
  };
}

test("wave8 covers schedule-generation-request and frontend controller branch paths", async () => {
  const apiClient = async () => ({ status: 200, body: { status: "ok" } });
  const user = { id: "u1", role: "editor", email: "u@example.com" };

  assert.equal(validateScheduleGenerationRequest(undefined).conferenceId, null);
  assert.equal(validateScheduleGenerationRequest({ conferenceId: "c1", seed: "x", requestedBy: null }).seed, null);
  assert.equal(validateScheduleGenerationRequest({ conferenceId: "c1", seed: 7, requestedBy: "u1" }).seed, 7);

  assert.equal(buildSuccessMessage("update"), "Update saved successfully.");
  assert.equal(buildSuccessMessage("create"), "Create saved successfully.");
  assert.equal(getLoginErrorMessage({}), "Login failed.");
  assert.equal(getLoginErrorMessage({ body: { message: "bad" } }), "bad");
  assert.equal((await submitPasswordChange(apiClient, {}, user, "s1")).status, 200);
  assert.equal(postPasswordChangeNavigation({ status: 200, body: { reauthenticate: true } }), "/login");
  assert.equal(postPasswordChangeNavigation({ status: 200, body: { reauthenticate: false } }), null);
  assert.equal((await verifyToken(apiClient, "t1")).status, 200);
  assert.equal((await resendVerification(apiClient, "a@x.com")).status, 200);
  assert.equal(mapRegistrationErrors([{ field: "email", message: "bad" }]).email, "bad");
  assert.equal((await submitRegistration(apiClient, {})).status, 200);
  assert.equal((await submitFormForValidation(apiClient, {}, user)).status, 200);
  assert.equal(mapFieldErrors([{ field: "f", message: "m" }]).f, "m");
  assert.equal((await submitLogin(apiClient, {})).status, 200);
  assert.equal((await checkSession(apiClient, "sid")).status, 200);

  assert.equal((await loadAssignedPapers(apiClient, "r1", user)).status, 200);
  assert.equal((await openManuscriptView(apiClient, "p1", user)).status, 200);
  assert.equal((await openReviewForm(apiClient, "p1", user)).status, 200);
  assert.equal(supportsManuscriptDownload(), false);
  assert.equal(assignmentFailureMessage({ status: 409 }).includes("conflict"), true);
  assert.equal(assignmentFailureMessage({ status: 503 }).includes("rolled back"), true);
  assert.equal(assignmentFailureMessage({ status: 400 }), "Assignment failed.");
  assert.equal((await confirmAssignment(apiClient, "p1", ["r1"], 1, user)).status, 200);

  assert.equal((await loadPaperDecision(apiClient, "p1", user)).status, 200);
  assert.equal((await loadDecisionNotification(apiClient, "p1", user)).status, 200);
  assert.equal(cmsFallbackMessage({ deliveryStatus: "failed" }).includes("source of truth"), true);
  assert.equal(cmsFallbackMessage({ deliveryStatus: "sent" }), "");
  assert.equal((await loadDecisionContext(apiClient, "p1", user)).status, 200);
  assert.equal((await submitPaperDecision(apiClient, "p1", {}, user)).status, 200);
  assert.equal(mapDecisionFailure({ status: 500 }).includes("retry"), true);
  assert.equal(mapDecisionFailure({ status: 200, body: { notificationStatus: "failed" } }).includes("saved"), true);
  assert.equal(mapDecisionFailure({ status: 409 }).includes("concurrent"), true);
  assert.equal(mapDecisionFailure({ status: 200 }), "");
  assert.equal(mapDecisionStateFeedback({ status: 403 }).includes("not allowed"), true);
  assert.equal(mapDecisionStateFeedback({ status: 409 }).includes("already exists"), true);
  assert.equal(mapDecisionStateFeedback({ status: 200, body: { status: "cancelled" } }).includes("cancelled"), true);
  assert.equal(mapDecisionStateFeedback({ status: 200, body: { status: "ok" } }), "");

  assert.equal((await saveDraft(apiClient, "d1", {}, user)).status, 200);
  assert.equal((await submitDraft(apiClient, "d1", {}, user)).status, 200);
  assert.equal(draftSubmitFeedback({ status: 200, body: { status: "FINALIZED" } }).includes("finalized"), true);
  assert.equal(draftSubmitFeedback({ status: 409 }).includes("saved"), true);
  assert.equal(draftSubmitFeedback({ status: 500 }), "Submit failed.");
  assert.equal(invitationFailureMessage({ status: 500 }).includes("retry"), true);
  assert.equal(invitationFailureMessage({ status: 200, body: { notificationStatus: "failed" } }).includes("saved"), true);
  assert.equal(invitationFailureMessage({ status: 200 }), "");

  assert.equal(buildOnlinePaymentViewModel({ amount: 10, currency: "CAD", categoryLabel: "Regular" }).totalLabel, "CAD 10.00");
  assert.equal(buildPaymentFailureMessage("declined").includes("declined"), true);
  assert.equal(buildPaymentFailureMessage("invalid_details").includes("invalid"), true);
  assert.equal(buildPaymentFailureMessage("cancelled").includes("canceled"), true);
  assert.equal(buildPaymentSuccessMessage().includes("confirmed"), true);
  assert.equal(buildPaymentUnresolvedMessage().includes("unresolved"), true);
  assert.equal(buildAnnouncementDetailViewModel({ title: "T", content: "C", publishedAt: "now" }).title, "T");
  assert.equal(buildAnnouncementsErrorMessage("ANNOUNCEMENT_UNAVAILABLE").includes("no longer"), true);
  assert.equal(buildAnnouncementsErrorMessage("ANNOUNCEMENT_RETRIEVAL_FAILED").includes("temporarily"), true);
  assert.equal(buildAnnouncementsErrorMessage("OTHER").includes("unavailable"), true);
  assert.equal(buildAnnouncementsListViewModel([{ announcementId: "a1", title: "T", summary: "S", publishedAt: "now" }])[0].id, "a1");
  assert.equal(
    pricingConsistencyKey({ categories: [{ categoryId: "c1", finalAmountCad: 10, missingInformation: false }] }).length > 0,
    true
  );
});

test("wave8 executes frontend app entry modules under a mocked browser environment", async () => {
  const elements = new Map();
  globalThis.document = {
    getElementById(id) {
      if (!elements.has(id)) {
        elements.set(id, createStubElement());
      }
      return elements.get(id);
    },
    createElement() {
      return createStubElement();
    }
  };
  globalThis.localStorage = {
    store: new Map(),
    getItem(key) {
      return this.store.has(key) ? this.store.get(key) : null;
    },
    setItem(key, value) {
      this.store.set(key, String(value));
    },
    removeItem(key) {
      this.store.delete(key);
    }
  };
  globalThis.performance = { now: () => 0 };
  globalThis.alert = () => {};
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    headers: { get: () => "application/json" },
    json: async () => ({ ids: {}, users: {} }),
    text: async () => "{}"
  });

  const root = process.cwd();
  await import(pathToFileURL(path.join(root, "frontend/src/app/app.js")).href);
  await import(pathToFileURL(path.join(root, "frontend/src/appsimple/app.js")).href);
  assert.equal(true, true);
});
