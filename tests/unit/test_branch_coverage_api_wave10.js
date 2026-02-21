import test from "node:test";
import assert from "node:assert/strict";

import { AssignedPaperRepository } from "../../backend/src/models/assigned-paper.js";
import { createGetManuscriptViewController } from "../../backend/src/api/assigned-access/get-manuscript-view-controller.js";
import { createGetReviewFormController } from "../../backend/src/api/assigned-access/get-review-form-controller.js";
import { PaperRefereeAssignmentRepository } from "../../backend/src/models/paper-referee-assignment.js";
import { createConfirmAssignmentController } from "../../backend/src/api/assignments/confirm-assignment-controller.js";
import { PaymentWorkflowStore } from "../../backend/src/models/payment-workflow-store.js";
import { createGetPaymentStatusController } from "../../backend/src/api/payments/get-payment-status-controller.js";
import { mapGatewayOutcome } from "../../backend/src/api/payments/payment-outcome-feedback-mapper.js";
import { createPostGatewayConfirmController } from "../../backend/src/api/payments/post-gateway-confirm-controller.js";
import { createPostPaymentInitiateController } from "../../backend/src/api/payments/post-payment-initiate-controller.js";
import { AnnouncementStore } from "../../backend/src/models/announcement-store.js";
import { createGetPublicAnnouncementDetailController } from "../../backend/src/api/public-announcements/get-public-announcement-detail-controller.js";
import { createGetCompletedReviewsController } from "../../backend/src/api/review-view/get-completed-reviews-controller.js";
import { createGetEditableScheduleController } from "../../backend/src/api/schedule-edit/get-editable-schedule-controller.js";
import { createPostSaveScheduleController } from "../../backend/src/api/schedule-edit/post-save-schedule-controller.js";
import { createGetPublishedScheduleController } from "../../backend/src/api/schedule/get-published-schedule-controller.js";
import { createPostGenerateScheduleController } from "../../backend/src/api/schedule/post-generate-schedule-controller.js";
import { TicketStore } from "../../backend/src/models/ticket-store.js";
import { createPostIssueTicketController } from "../../backend/src/api/tickets/post-issue-ticket-controller.js";
import { createAssignRefereeController } from "../../backend/src/api/workload/assign-referee-controller.js";
import { ScheduleDraftRepository } from "../../backend/src/models/schedule-draft.js";

test("wave10 covers remaining backend/src/api branch stragglers", () => {
  const assignedRepo = new AssignedPaperRepository();
  const manuscriptCtl = createGetManuscriptViewController({ assignedPaperRepository: assignedRepo });
  const reviewFormCtl = createGetReviewFormController({ assignedPaperRepository: assignedRepo });
  assert.equal(manuscriptCtl.get({ params: { paperId: "p1" } }).status, 401);
  assert.equal(reviewFormCtl.get({ params: { paperId: "p1" } }).status, 401);

  const assignmentRepo = new PaperRefereeAssignmentRepository();
  assignmentRepo.seedPaper({ paperId: "p1", version: 1 });
  assignmentRepo.seedReferee({ refereeId: "r1", eligible: true, currentLoad: 0, maxLoad: 3 });
  const confirmCtl = createConfirmAssignmentController({
    paperRefereeAssignmentRepository: assignmentRepo,
    reviewInvitationService: { sendInvitation() {} }
  });
  const confirmRes = confirmCtl.confirm({ user: { email: "ed@example.com", role: "editor" }, params: { paperId: "p1" } });
  assert.equal(confirmRes.status, 400);

  const paymentStore = new PaymentWorkflowStore();
  paymentStore.seedRegistration({ registrationId: "reg-1", attendeeId: "u1", state: "paid_confirmed", amount: 100, currency: "CAD" });
  paymentStore.updateRegistration("reg-1", { paymentId: "pay-1", message: "already paid" });
  const getPayStatusCtl = createGetPaymentStatusController({ paymentWorkflowStore: paymentStore });
  const payStatus = getPayStatusCtl.get({ user: { id: "u1" }, params: { registrationId: "reg-1" } });
  assert.equal(payStatus.status, 200);
  assert.equal(payStatus.body.message, "already paid");

  assert.equal(mapGatewayOutcome("success"), "confirmed");

  const postGatewayCtl = createPostGatewayConfirmController({
    paymentWorkflowStore: paymentStore,
    paymentObservabilityService: { record() {} }
  });
  assert.equal(postGatewayCtl.post({}).status, 400);

  const initiateCtl = createPostPaymentInitiateController({ paymentWorkflowStore: paymentStore });
  assert.equal(initiateCtl.post({ params: { registrationId: "reg-1" }, body: { categoryId: "regular" } }).status, 401);

  const announcementStore = new AnnouncementStore();
  announcementStore.failDetailOnce();
  const detailCtl = createGetPublicAnnouncementDetailController({
    announcementStore,
    publicAnnouncementsObservabilityService: { record() {} }
  });
  assert.equal(detailCtl.get({ params: { announcementId: "a1" } }).status, 500);

  const reviewsCtl = createGetCompletedReviewsController({});
  assert.equal(reviewsCtl.get({ params: { paperId: "p1" } }).status, 401);

  const scheduleRepo = new ScheduleDraftRepository();
  scheduleRepo.seedConference({
    conferenceId: "c1",
    acceptedPapers: [{ paperId: "p1" }],
    rooms: [{ roomId: "r1", roomName: "Room A" }],
    parameters: { slotMinutes: 30, totalSlots: 2, startMinute: 540 }
  });
  const draft = scheduleRepo.createDraft({
    conferenceId: "c1",
    grid: { columns: [] },
    placements: [{ paperId: "p1", roomId: "r1", slotIndex: 0 }],
    conflicts: []
  });
  scheduleRepo.publishDraft({ conferenceId: "c1", draftId: draft.draftId });

  const versions = new Map([["c1", 5]]);
  const getEditableCtl = createGetEditableScheduleController({
    scheduleDraftRepository: scheduleRepo,
    scheduleEditVersions: versions
  });
  const editable = getEditableCtl.get({ user: { email: "ed@example.com", role: "editor" }, params: { conferenceId: "c1" } });
  assert.equal(editable.status, 200);
  assert.equal(editable.body.version, 5);

  const saveEditableCtl = createPostSaveScheduleController({
    scheduleDraftRepository: scheduleRepo,
    scheduleEditVersions: versions,
    scheduleEditObservabilityService: { record() {} }
  });
  const saveRes = saveEditableCtl.post({
    user: { email: "ed@example.com", role: "editor" },
    params: { conferenceId: "c1" },
    body: { expectedVersion: 5, edits: { placements: [{ paperId: "p1", roomId: "r1", slotIndex: 0 }], conflicts: [] } }
  });
  assert.equal(saveRes.status, 200);

  const getPublishedCtl = createGetPublishedScheduleController({ scheduleDraftRepository: scheduleRepo });
  assert.equal(getPublishedCtl.get({ params: { conferenceId: "c1" } }).status, 401);

  const generateCtl = createPostGenerateScheduleController({
    scheduleDraftRepository: scheduleRepo,
    roomAvailabilityService: (rooms) => rooms,
    scheduleGenerationObservabilityService: { record() {} }
  });
  const genRes = generateCtl.post({
    user: { email: "ed@example.com", role: "editor" },
    params: { conferenceId: "c1" },
    body: { seed: "s1" }
  });
  assert.equal(genRes.status, 200);

  const ticketStore = new TicketStore();
  ticketStore.saveTicket({ registrationId: "reg-1", ticketReference: "T-1", qrCode: "qr-1" });
  const issueCtl = createPostIssueTicketController({
    paymentWorkflowStore: paymentStore,
    ticketStore,
    ticketObservabilityService: { record() {} }
  });
  const existingTicket = issueCtl.post({ user: { id: "u1" }, params: { registrationId: "reg-1" } });
  assert.equal(existingTicket.status, 200);
  assert.equal(existingTicket.body.ticketReference, "T-1");

  const workloadCtl = createAssignRefereeController({});
  assert.equal(workloadCtl.assign({ params: { paperId: "p1" }, body: { referee_id: "r1" } }).status, 401);
});
