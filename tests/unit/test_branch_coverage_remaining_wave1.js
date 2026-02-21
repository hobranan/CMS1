import test from "node:test";
import assert from "node:assert/strict";

import { createGetPaymentStatusController } from "../../backend/src/api/payments/get-payment-status-controller.js";
import { evaluatePaymentInitiationEligibility } from "../../backend/src/services/payments/payment-initiation-eligibility-service.js";
import { buildSlotGrid } from "../../backend/src/services/schedule/slot-grid-builder.js";
import { validatePasswordChangePayload } from "../../backend/src/services/account/password_change_validation_service.js";
import { createGetDecisionNotificationController } from "../../backend/src/api/decision-notification/get-decision-notification.js";
import { createGetPaperDecisionController } from "../../backend/src/api/decision-notification/get-paper-decision.js";
import { validateInvitationActionable } from "../../backend/src/services/invitations/invitation-actionable-validation-service.js";
import { validateAndPersistSubmission } from "../../backend/src/services/validation/validation_service.js";
import { AnnouncementStore } from "../../backend/src/models/announcement-store.js";
import { PaperDecisionRepository } from "../../backend/src/models/decision-record.js";

test("payment status controller and initiation eligibility cover remaining branches", () => {
  const statusController = createGetPaymentStatusController({
    paymentWorkflowStore: {
      getRegistration(id) {
        if (id === "missing") return null;
        if (id === "owned") return { registrationId: "owned", attendeeId: "u1", state: "pending", paymentId: "pay-1", message: "Wait" };
        return { registrationId: id, attendeeId: "u2", state: "unpaid" };
      }
    }
  });

  assert.equal(statusController.get({ user: null, params: { registrationId: "owned" } }).status, 401);
  assert.equal(statusController.get({ user: { id: "u1" }, params: { registrationId: "missing" } }).status, 404);
  assert.equal(statusController.get({ user: { id: "u1" }, params: { registrationId: "other" } }).status, 404);
  const ok = statusController.get({ user: { id: "u1" }, params: { registrationId: "owned" } });
  assert.equal(ok.status, 200);
  assert.equal(ok.body.paymentId, "pay-1");
  assert.equal(ok.body.message, "Wait");

  const eligibilityStore = {
    getRegistration(id) {
      if (id === "none") return null;
      if (id === "paid") return { registrationId: "paid", attendeeId: "u1", state: "paid_confirmed", categoryId: "standard" };
      if (id === "no-cat") return { registrationId: "no-cat", attendeeId: "u1", state: "unpaid", categoryId: null };
      return { registrationId: "ok", attendeeId: "u1", state: "unpaid", categoryId: "regular" };
    }
  };
  assert.equal(evaluatePaymentInitiationEligibility(eligibilityStore, { registrationId: "none", userId: "u1" }).ok, false);
  assert.equal(evaluatePaymentInitiationEligibility(eligibilityStore, { registrationId: "ok", userId: "u2" }).ok, false);
  assert.equal(evaluatePaymentInitiationEligibility(eligibilityStore, { registrationId: "no-cat", userId: "u1" }).code, "REGISTRATION_CATEGORY_REQUIRED");
  assert.equal(evaluatePaymentInitiationEligibility(eligibilityStore, { registrationId: "paid", userId: "u1" }).code, "DUPLICATE_PAYMENT_ATTEMPT");
  assert.equal(evaluatePaymentInitiationEligibility(eligibilityStore, { registrationId: "ok", userId: "u1", categoryId: "vip" }).ok, true);
});

test("slot grid and password change payload cover defaults and populated branches", () => {
  const defaultGrid = buildSlotGrid({
    rooms: [{ roomId: "r1", roomName: "R1" }],
    parameters: {}
  });
  assert.equal(defaultGrid.totalSlots, 4);
  assert.equal(defaultGrid.slotMinutes, 30);
  assert.equal(defaultGrid.columns[0].slots[0].startMinute, 540);

  const customGrid = buildSlotGrid({
    rooms: [
      { roomId: "r1", roomName: "R1" },
      { roomId: "r2", roomName: "R2" }
    ],
    parameters: { slotMinutes: 20, totalSlots: 2, startMinute: 600 }
  });
  assert.equal(customGrid.columns.length, 2);
  assert.equal(customGrid.columns[1].slots[1].startMinute, 620);
  assert.equal(customGrid.columns[1].slots[1].endMinute, 640);

  const missing = validatePasswordChangePayload({});
  assert.equal(missing.errors.length, 3);
  const partial = validatePasswordChangePayload({ current_password: "old", new_password: "", confirm_new_password: "x" });
  assert.ok(partial.errors.some((e) => e.field === "new_password"));
  const complete = validatePasswordChangePayload({
    current_password: "old",
    new_password: "NewPass!123",
    confirm_new_password: "NewPass!123"
  });
  assert.equal(complete.errors.length, 0);
});

test("decision notification controllers cover auth, ownership, under-review, missing notification, failures, and success", () => {
  const repo = new PaperDecisionRepository();
  repo.seedPaper({
    paperId: "p1",
    editorId: "ed-1",
    authors: ["a1"],
    fullReviewContent: "Detailed review",
    reviewHighlights: ["Strong novelty"],
    notificationAvailable: true
  });

  const notifController = createGetDecisionNotificationController({ paperDecisionRepository: repo });
  const paperController = createGetPaperDecisionController({ paperDecisionRepository: repo });

  assert.equal(notifController.get({ user: null, params: { paperId: "p1" } }).status, 401);
  assert.equal(notifController.get({ user: { email: "x", role: "author", id: "a2" }, params: { paperId: "p1" } }).status, 403);
  assert.equal(notifController.get({ user: { email: "x", role: "author", id: "a1" }, params: { paperId: "missing" } }).status, 404);

  const underReview = notifController.get({ user: { email: "x", role: "author", id: "a1" }, params: { paperId: "p1" } });
  assert.equal(underReview.status, 200);
  assert.equal(underReview.body.decisionStatus, "under_review");

  repo.seedPaper({
    paperId: "p2",
    editorId: "ed-1",
    authors: ["a1"],
    fullReviewContent: "Details",
    reviewHighlights: ["Summary"],
    notificationAvailable: false
  });
  repo.createDecision({
    paperId: "p2",
    editorId: "ed-1",
    outcome: "accept",
    comment: "ok",
    now: new Date("2026-02-21T00:00:00.000Z")
  });
  assert.equal(notifController.get({ user: { email: "x", role: "author", id: "a1" }, params: { paperId: "p2" } }).status, 404);

  repo.failNextDecisionRead();
  assert.equal(notifController.get({ user: { email: "x", role: "author", id: "a1" }, params: { paperId: "p2" } }).status, 500);

  repo.seedPaper({
    paperId: "p3",
    editorId: "ed-1",
    authors: ["a1"],
    fullReviewContent: "Full text",
    reviewHighlights: ["Top point"],
    notificationAvailable: true,
    notificationDeliveryStatus: null
  });
  repo.createDecision({
    paperId: "p3",
    editorId: "ed-1",
    outcome: "reject",
    comment: "",
    now: new Date("2026-02-21T00:00:00.000Z")
  });
  const successNotif = notifController.get({ user: { email: "x", role: "author", id: "a1" }, params: { paperId: "p3" } });
  assert.equal(successNotif.status, 200);
  assert.equal(successNotif.body.deliveryStatus, "sent");

  assert.equal(paperController.get({ user: null, params: { paperId: "p3" } }).status, 401);
  const underReviewPaper = paperController.get({ user: { email: "x", role: "author", id: "a1" }, params: { paperId: "p1" } });
  assert.equal(underReviewPaper.status, 200);
  assert.equal(underReviewPaper.body.decisionStatus, "under_review");
  const finalPaper = paperController.get({ user: { email: "x", role: "author", id: "a1" }, params: { paperId: "p3" } });
  assert.equal(finalPaper.status, 200);
  assert.equal(finalPaper.body.deliveryStatus, "sent");
});

test("invitation actionable, validation service, and announcement store branches", () => {
  const now = new Date("2026-02-21T00:00:00.000Z");
  assert.equal(validateInvitationActionable({ invitation: null, now }).code, "INVITATION_NOT_FOUND");
  assert.equal(validateInvitationActionable({ invitation: { status: "withdrawn" }, now }).code, "INVITATION_WITHDRAWN");
  assert.equal(validateInvitationActionable({ invitation: { status: "accepted" }, now }).code, "INVITATION_ALREADY_RESPONDED");
  assert.equal(validateInvitationActionable({ invitation: { status: "rejected" }, now }).code, "INVITATION_ALREADY_RESPONDED");
  assert.equal(validateInvitationActionable({ invitation: { status: "processing" }, now }).code, "INVITATION_NOT_ACTIONABLE");
  assert.equal(
    validateInvitationActionable({
      invitation: { status: "pending", issuedAt: "2026-02-01T00:00:00.000Z" },
      now
    }).code,
    "INVITATION_EXPIRED"
  );
  assert.equal(
    validateInvitationActionable({
      invitation: { status: "pending", issuedAt: "2026-02-20T00:00:00.000Z" },
      now
    }).ok,
    true
  );

  const unknown = validateAndPersistSubmission(
    {
      formSubmissionRepository: { recordValidationResult() {} },
      atomicPersistence: { persistAtomically() {} }
    },
    { body: { formId: "unknown_form" } }
  );
  assert.equal(unknown.status, 422);
  assert.equal(unknown.body.code, "UNKNOWN_FORM");

  const store = new AnnouncementStore();
  store.seedAnnouncements([{ announcementId: "a1", title: "T", content: "C" }]);
  assert.equal(store.getAll().length, 1);
  store.failListOnce();
  assert.throws(() => store.getAll(), /ANNOUNCEMENT_LIST_RETRIEVAL_FAILED/);
  assert.equal(store.getById("missing"), null);
  store.failDetailOnce();
  assert.throws(() => store.getById("a1"), /ANNOUNCEMENT_DETAIL_RETRIEVAL_FAILED/);
  store.markUnavailable("a1");
  assert.equal(store.getById("a1").isAvailable, false);
});
