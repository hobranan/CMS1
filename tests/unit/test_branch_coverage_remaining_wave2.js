import test from "node:test";
import assert from "node:assert/strict";

import { validateNewPassword } from "../../backend/src/services/security/password_policy_validator.js";
import { hashSecret } from "../../backend/src/services/security/password_crypto_service.js";
import { getDecisionWithFailureHandling } from "../../backend/src/services/decision-notification/get-decision-with-failure-handling.js";
import { createPostSaveScheduleController } from "../../backend/src/api/schedule-edit/post-save-schedule-controller.js";
import { ScheduleDraftRepository } from "../../backend/src/models/schedule-draft.js";
import { createRegistration } from "../../backend/src/services/registration/registration_service.js";
import { RegistrationRepository } from "../../backend/src/models/registration_repository.js";
import { createRetryUploadController } from "../../backend/src/api/uploads/retry-upload-controller.js";
import { createGetDraftController } from "../../backend/src/api/drafts/get-draft-controller.js";
import { createGetWorkloadController } from "../../backend/src/api/workload/get-workload-controller.js";
import { createUploadStatusController } from "../../backend/src/api/submissions/upload-status-controller.js";
import { updatePasswordAndHistory } from "../../backend/src/services/account/password_update_transaction_service.js";
import { createConfirmAssignmentController } from "../../backend/src/api/assignments/confirm-assignment-controller.js";
import { canIssueTicket } from "../../backend/src/services/tickets/ticket-issuance-eligibility-service.js";
import { getAssignedManuscript, getAssignedReviewForm } from "../../backend/src/services/assigned-access/assigned-resource-retrieval-service.js";
import { SubmissionDraftRepository } from "../../backend/src/models/submission-draft.js";
import { createGetTicketMetadataController } from "../../backend/src/api/tickets/get-ticket-metadata-controller.js";

test("password policy validator and decision retrieval handling cover remaining branches", () => {
  const currentHash = hashSecret("Current!1234");
  const historyHash = hashSecret("History!1234");

  const strictConfig = {
    minLength: 12,
    requireUpper: true,
    requireLower: true,
    requireNumber: true,
    requireSpecial: true,
    forbidSpaces: true
  };

  const errors = validateNewPassword({
    newPassword: "Current!1234",
    currentPassword: "Current!1234",
    currentPasswordHash: currentHash,
    recentHistoryHashes: [historyHash],
    config: strictConfig
  });
  assert.ok(errors.some((e) => e.code === "NEW_EQUALS_CURRENT"));

  const missingUpper = validateNewPassword({
    newPassword: "current!1234",
    currentPassword: "Current!1234",
    currentPasswordHash: currentHash,
    recentHistoryHashes: [historyHash],
    config: strictConfig
  });
  assert.ok(missingUpper.some((e) => e.code === "PASSWORD_MISSING_UPPERCASE"));

  const historyReuse = validateNewPassword({
    newPassword: "History!1234",
    currentPassword: "Current!1234",
    currentPasswordHash: currentHash,
    recentHistoryHashes: [historyHash],
    config: strictConfig
  });
  assert.ok(historyReuse.some((e) => e.code === "PASSWORD_HISTORY_REUSE"));

  const good = validateNewPassword({
    newPassword: "Fresh!1234Pass",
    currentPassword: "Current!1234",
    currentPasswordHash: currentHash,
    recentHistoryHashes: [historyHash],
    config: strictConfig
  });
  assert.equal(good.length, 0);

  const repo = {
    paperDecisionRepository: {
      getPaper(id) {
        if (id === "missing") return null;
        if (id === "explode") throw new Error("boom");
        return { paperId: id };
      }
    },
    getDecisionForPaper(id) {
      if (id === "none") return null;
      if (id === "accept") return { outcome: "accept", comment: "ok" };
      if (id === "reject") return { outcome: "reject", comment: "no" };
      if (id === "errorCode") {
        const err = new Error("x");
        err.code = "DECISION_RETRIEVAL_FAILURE";
        throw err;
      }
      return { outcome: "other" };
    }
  };

  assert.equal(getDecisionWithFailureHandling(repo, "none").decisionStatus, "under_review");
  assert.equal(getDecisionWithFailureHandling(repo, "accept").decisionStatus, "accepted");
  assert.equal(getDecisionWithFailureHandling(repo, "reject").decisionStatus, "rejected");
  assert.equal(getDecisionWithFailureHandling(repo, "weird").decisionStatus, "under_review");
  assert.throws(() => getDecisionWithFailureHandling(repo, "missing"), /Paper not found/);
  assert.throws(() => getDecisionWithFailureHandling(repo, "errorCode"), /x/);
  assert.throws(() => getDecisionWithFailureHandling(repo, "explode"), /Decision details are temporarily unavailable\./);
});

test("post-save schedule controller and schedule draft repository cover branch paths", () => {
  const baseDeps = {
    scheduleDraftRepository: {
      getConference() {
        return { editLocked: false, lockReason: "Locked by policy" };
      },
      getPublished() {
        return { conferenceId: "c1", status: "published", placements: [], conflicts: [] };
      }
    },
    scheduleEditVersions: new Map([["c1", 2]])
  };
  const ctrl = createPostSaveScheduleController(baseDeps);

  assert.equal(ctrl.post({ user: null, params: { conferenceId: "c1" }, body: {} }).status, 401);
  assert.equal(ctrl.post({ user: { email: "a@x.com", role: "author" }, params: { conferenceId: "c1" }, body: {} }).status, 403);

  const lockedCtrl = createPostSaveScheduleController({
    ...baseDeps,
    scheduleDraftRepository: { ...baseDeps.scheduleDraftRepository, getConference() { return { editLocked: true, lockReason: "Manual lock" }; } }
  });
  assert.equal(lockedCtrl.post({ user: { email: "e@x.com", role: "editor" }, params: { conferenceId: "c1" }, body: {} }).status, 423);

  const stale = ctrl.post({
    user: { email: "e@x.com", role: "editor" },
    params: { conferenceId: "c1" },
    body: { expectedVersion: 1, edits: { placements: [] } }
  });
  assert.equal(stale.status, 409);

  const noDraftCtrl = createPostSaveScheduleController({
    ...baseDeps,
    scheduleDraftRepository: { ...baseDeps.scheduleDraftRepository, getPublished() { return null; } }
  });
  assert.equal(
    noDraftCtrl.post({
      user: { email: "e@x.com", role: "editor" },
      params: { conferenceId: "c1" },
      body: { expectedVersion: 2, edits: { placements: [] } }
    }).status,
    404
  );

  const invalid = ctrl.post({
    user: { email: "e@x.com", role: "editor" },
    params: { conferenceId: "c1" },
    body: { expectedVersion: 2, edits: { placements: [{ paperId: "p1" }] } }
  });
  assert.equal(invalid.status, 400);

  const saveFailureCtrl = createPostSaveScheduleController({
    ...baseDeps,
    scheduleDraftRepository: { ...baseDeps.scheduleDraftRepository, failNextEditSave: true },
    scheduleEditObservabilityService: { record() {} }
  });
  const failed = saveFailureCtrl.post({
    user: { email: "e@x.com", role: "editor" },
    params: { conferenceId: "c1" },
    body: { expectedVersion: 2, edits: { placements: [], conflicts: [] } }
  });
  assert.equal(failed.status, 500);

  const saved = ctrl.post({
    user: { email: "e@x.com", role: "editor" },
    params: { conferenceId: "c1" },
    body: { expectedVersion: 2, edits: { placements: [], conflicts: [] } }
  });
  assert.equal(saved.status, 200);
  assert.equal(saved.body.version, 3);

  const repo = new ScheduleDraftRepository();
  repo.seedConference({ conferenceId: "c1" });
  repo.failNextDraftSave();
  assert.throws(() => repo.createDraft({ conferenceId: "c1", grid: [], placements: [], conflicts: [] }), /SCHEDULE_SAVE_FAILURE/);
  const draft = repo.createDraft({ conferenceId: "c1", grid: [], placements: [], conflicts: [] });
  assert.equal(repo.getDraft("missing"), null);
  assert.equal(repo.publishDraft({ conferenceId: "c2", draftId: draft.draftId }), null);
  assert.equal(repo.publishDraft({ conferenceId: "c1", draftId: draft.draftId }).status, "published");
});

test("registration service and remaining small controllers/services cover branches", () => {
  const now = new Date("2026-02-21T00:00:00.000Z");
  const repo = new RegistrationRepository();
  const deps = {
    repository: repo,
    nowProvider: () => now,
    verificationEmailService: { sendVerificationEmail() {} }
  };

  const bad = createRegistration(deps, { body: { email: "", password: "", confirmPassword: "" } });
  assert.equal(bad.status, 422);

  repo.createActiveUser({ email: "dup@example.com", passwordHash: "h", now });
  assert.equal(
    createRegistration(deps, { body: { email: "dup@example.com", password: "Strong!123456", confirmPassword: "Strong!123456" } }).status,
    422
  );

  const pendingRepo = new RegistrationRepository();
  pendingRepo.createPendingRegistration({
    email: "pending@example.com",
    passwordHash: "h",
    now,
    expiresAt: new Date("2026-02-28T00:00:00.000Z")
  });
  assert.equal(
    createRegistration(
      {
        ...deps,
        repository: pendingRepo
      },
      { body: { email: "pending@example.com", password: "Strong!123456", confirmPassword: "Strong!123456" } }
    ).status,
    422
  );

  const retryCtrl = createRetryUploadController({
    uploadProgressStateRepository: { getCheckpoint() { return null; }, clearCheckpoint() {} },
    uploadObservabilityService: { record() {} }
  });
  assert.equal(retryCtrl.retryMode({ params: {}, body: {} }).status, 400);
  assert.equal(
    retryCtrl.retryMode({ params: { submissionId: "s1" }, body: { file_fingerprint: "f1" } }).status,
    200
  );

  const getDraftCtrl = createGetDraftController({
    submissionDraftRepository: { get() { return null; } }
  });
  assert.equal(getDraftCtrl.get({ user: null, params: { draftId: "d1" } }).status, 401);
  assert.equal(getDraftCtrl.get({ user: { email: "a@x.com" }, params: { draftId: "d1" } }).status, 404);

  const workloadCtrl = createGetWorkloadController({
    refereeWorkloadRetrievalService: { getCurrentWorkload() { throw new Error("x"); } },
    workloadLimitRuleRepository: {}
  });
  assert.equal(workloadCtrl.get({ user: null, params: { refereeId: "r1" }, query: {} }).status, 401);
  assert.equal(workloadCtrl.get({ user: { email: "e@x.com", role: "editor" }, params: { refereeId: "r1" }, query: {} }).status, 503);

  const uploadStatusCtrl = createUploadStatusController({
    paperSubmissionRepository: { setInterrupted() { return null; } },
    submissionObservabilityService: { record() {} }
  });
  assert.equal(uploadStatusCtrl.reportStatus({ body: {} }).status, 400);
  assert.equal(uploadStatusCtrl.reportStatus({ body: { submission_id: "s1", status: "INTERRUPTED" } }).status, 200);

  assert.throws(
    () =>
      updatePasswordAndHistory({
        credentialRepository: { getUserByEmail() { return null; } },
        passwordHistoryRepository: { pushHash() {} },
        email: "a@x.com",
        newPasswordHash: "new",
        now
      }),
    /Account not found/
  );
  assert.throws(
    () =>
      updatePasswordAndHistory({
        credentialRepository: {
          getUserByEmail() { return { passwordHash: "old" }; },
          updatePasswordHash() { return null; }
        },
        passwordHistoryRepository: { pushHash() {} },
        email: "a@x.com",
        newPasswordHash: "new",
        now
      }),
    /Account not found/
  );
  const updated = updatePasswordAndHistory({
    credentialRepository: {
      getUserByEmail() { return { passwordHash: "old" }; },
      updatePasswordHash() { return { email: "a@x.com" }; }
    },
    passwordHistoryRepository: { pushHash() {} },
    email: "a@x.com",
    newPasswordHash: "new",
    now
  });
  assert.equal(updated.email, "a@x.com");

  const confirmCtrl = createConfirmAssignmentController({});
  assert.equal(confirmCtrl.confirm({ user: null, params: {}, body: {} }).status, 401);

  const paymentStore = {
    getRegistration(id) {
      if (id === "none") return null;
      if (id === "pending") return { registrationId: id, attendeeId: "u1", state: "pending" };
      return { registrationId: id, attendeeId: "u1", state: "paid_confirmed", paymentId: "pay-1" };
    }
  };
  const ticketStore = { getTicketByRegistrationId(id) { return id === "paid-with-ticket" ? { ticketId: "t1" } : null; } };
  assert.equal(canIssueTicket(paymentStore, ticketStore, "none", "u1").ok, false);
  assert.equal(canIssueTicket(paymentStore, ticketStore, "paid", "u2").ok, false);
  assert.equal(canIssueTicket(paymentStore, ticketStore, "pending", "u1").ok, false);
  assert.equal(canIssueTicket(paymentStore, ticketStore, "paid-with-ticket", "u1").existingTicket.ticketId, "t1");
  assert.equal(canIssueTicket(paymentStore, ticketStore, "paid", "u1").existingTicket, null);

  const manuscriptOk = getAssignedManuscript({ getManuscript() { return { paperId: "p1", contentUrl: "/m.pdf" }; } }, "p1");
  assert.equal(manuscriptOk.ok, true);
  assert.equal(getAssignedManuscript({ getManuscript() { return null; } }, "p1").status, 404);
  assert.equal(getAssignedManuscript({ getManuscript() { throw new Error("x"); } }, "p1").status, 500);

  const formOk = getAssignedReviewForm({ getReviewForm() { return { paperId: "p1", reviewFormId: "f1" }; } }, "p1");
  assert.equal(formOk.ok, true);
  assert.equal(getAssignedReviewForm({ getReviewForm() { return null; } }, "p1").status, 404);
  assert.equal(getAssignedReviewForm({ getReviewForm() { throw new Error("x"); } }, "p1").status, 500);

  const draftRepo = new SubmissionDraftRepository();
  const created = draftRepo.createDraft({ authorEmail: "a@x.com", now });
  assert.equal(draftRepo.get("none"), null);
  assert.equal(draftRepo.update("none", () => {}), null);
  assert.equal(draftRepo.update(created.id, (d) => { d.status = "UPDATED"; }).status, "UPDATED");

  const ticketMetaCtrl = createGetTicketMetadataController({
    paymentWorkflowStore: {
      getRegistration(id) {
        if (id === "none") return null;
        return { registrationId: id, attendeeId: "u1" };
      }
    },
    ticketStore: {
      getTicketByRegistrationId(id) {
        return id === "has-ticket" ? { ticketId: "t1", ticketReference: "R1", issuedAt: now.toISOString() } : null;
      },
      getPdfByRegistrationId() {
        return null;
      }
    }
  });
  assert.equal(ticketMetaCtrl.get({ user: null, params: { registrationId: "has-ticket" } }).status, 401);
  assert.equal(ticketMetaCtrl.get({ user: { id: "u2" }, params: { registrationId: "has-ticket" } }).status, 404);
  assert.equal(ticketMetaCtrl.get({ user: { id: "u1" }, params: { registrationId: "no-ticket" } }).status, 404);
  const metaOk = ticketMetaCtrl.get({ user: { id: "u1" }, params: { registrationId: "has-ticket" } });
  assert.equal(metaOk.status, 200);
  assert.equal(metaOk.body.retrievalAvailable, false);
});
