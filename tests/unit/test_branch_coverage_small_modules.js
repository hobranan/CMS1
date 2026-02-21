import test from "node:test";
import assert from "node:assert/strict";

import { requireAuthenticatedUser } from "../../backend/src/api/middleware/form_auth_guard.js";
import { scheduleRoleGuard } from "../../backend/src/api/middleware/schedule-role-guard.js";
import { createPostCancelScheduleEditController } from "../../backend/src/api/schedule-edit/post-cancel-schedule-edit-controller.js";
import { createListAuthorSubmissionsController } from "../../backend/src/api/submissions/list-author-submissions-controller.js";
import { createValidationController } from "../../backend/src/api/validation_controller.js";
import { createGetAssignmentDetailsController } from "../../backend/src/api/assignments/get-assignment-details-controller.js";
import { createGetCompletedReviewDetailController } from "../../backend/src/api/review-view/get-completed-review-detail-controller.js";

import { asGatewayConfirmationEvent } from "../../backend/src/models/gateway-confirmation-event.js";
import { asViewOnlyManuscript } from "../../backend/src/models/manuscript-view-resource.js";
import { asPaymentRecord } from "../../backend/src/models/payment-record.js";
import { asReconciliationItem } from "../../backend/src/models/reconciliation-item.js";
import { asPreGeneratedReviewForm } from "../../backend/src/models/review-form-access.js";
import { asSubmittedReviewRecord } from "../../backend/src/models/submitted-review.js";
import { asTicketPdfRecord } from "../../backend/src/models/ticket-pdf-record.js";
import { asCompletedReviewRecord } from "../../backend/src/models/completed-review-record.js";
import { InvitationResponseRepository } from "../../backend/src/models/invitation-response.js";
import { asPublishedSchedule } from "../../backend/src/models/public-schedule-models.js";
import { asScheduleEntry } from "../../backend/src/models/public-schedule-models.js";

import { invalidateCurrentSession } from "../../backend/src/services/auth/session_invalidation_service.js";
import { buildFullReviewSection } from "../../backend/src/services/decision-notification/full-review-section-builder.js";
import { detectDecisionConflict } from "../../backend/src/services/decisions/paper-decision-conflict-service.js";
import { persistPaperDecision } from "../../backend/src/services/decisions/paper-decision-persistence-service.js";
import { ensureSubmittedReviewReadOnly } from "../../backend/src/services/reviews/submitted-review-immutability-service.js";
import { validateSubmissionInput } from "../../backend/src/services/submissions/submission-validation-service.js";
import { validateAssignmentVersion } from "../../backend/src/services/assignments/referee-assignment-concurrency-service.js";
import { executeAssignmentTransaction } from "../../backend/src/services/assignments/referee-assignment-transaction-service.js";
import { validateLoginPayload } from "../../backend/src/services/auth/login_validation_service.js";
import { applyRegistrationPaymentState } from "../../backend/src/services/payments/registration-payment-state-service.js";

import { renderValidationResult } from "../../frontend/src/views/form_validation_view.js";
import { renderRegistrationState } from "../../frontend/src/views/registration_view.js";

test("form auth guard and schedule role guard enforce unauthenticated and forbidden branches", () => {
  assert.equal(requireAuthenticatedUser({}).allowed, false);
  assert.equal(requireAuthenticatedUser({ user: { id: "u1" } }).allowed, true);

  const noAuth = scheduleRoleGuard({});
  assert.equal(noAuth.ok, false);
  assert.equal(noAuth.status, 401);
  const forbidden = scheduleRoleGuard({ user: { email: "u@example.com", role: "author" } });
  assert.equal(forbidden.ok, false);
  assert.equal(forbidden.status, 403);
  assert.equal(scheduleRoleGuard({ user: { email: "u@example.com", role: "editor" } }).ok, true);
});

test("cancel schedule edit controller returns guard failure and success", () => {
  const controller = createPostCancelScheduleEditController();
  assert.equal(controller.post({ user: null }).status, 401);
  const ok = controller.post({ user: { email: "e@example.com", role: "editor" } });
  assert.equal(ok.status, 200);
  assert.equal(ok.body.status, "cancelled");
});

test("list-author-submissions controller returns auth-required and mapped list", () => {
  const controller = createListAuthorSubmissionsController({
    paperSubmissionRepository: {
      listByAuthorEmail() {
        return [
          {
            id: "s1",
            status: "FINALIZED",
            metadata: { title: "T1" },
            manuscriptFile: { fileName: "m.pdf", contentType: "application/pdf", sizeBytes: 123 }
          }
        ];
      }
    }
  });
  assert.equal(controller.listMine({ user: null }).status, 401);
  const ok = controller.listMine({ user: { email: "a@example.com" } });
  assert.equal(ok.status, 200);
  assert.equal(ok.body.submissions.length, 1);
});

test("validation controller covers auth failure, validation success, and catch branch", () => {
  const noAuthController = createValidationController({});
  assert.equal(noAuthController.submit({ user: null }).status, 401);

  const goodController = createValidationController({
    formSubmissionRepository: { recordValidationResult() {} },
    atomicPersistence: { persistAtomically: ({ recordId, payload }) => ({ id: recordId, payload }) },
    nowProvider: () => new Date("2026-02-21T00:00:00.000Z")
  });
  const good = goodController.submit({
    user: { id: "u1" },
    body: {
      formId: "profile_form",
      operation: "submit",
      recordId: "r1",
      data: { firstName: "A", lastName: "B", email: "ab@example.com", age: 30 }
    }
  });
  assert.equal(good.status, 200);

  const throwController = createValidationController({
    formSubmissionRepository: { recordValidationResult() {} },
    atomicPersistence: {
      persistAtomically() {
        throw new Error("boom");
      }
    }
  });
  const failed = throwController.submit({
    user: { id: "u1" },
    body: {
      formId: "profile_form",
      operation: "submit",
      recordId: "r2",
      data: { firstName: "A", lastName: "B", email: "ab@example.com", age: 30 }
    }
  });
  assert.equal(failed.status, 500);
});

test("assignment details controller covers auth and success", () => {
  const controller = createGetAssignmentDetailsController({
    paperRefereeAssignmentRepository: {
      getAssignment() {
        return { refereeIds: ["r1", "r2"] };
      }
    }
  });
  assert.equal(controller.get({ user: null, params: { paperId: "p1" } }).status, 401);
  const ok = controller.get({ user: { email: "e@example.com", role: "editor" }, params: { paperId: "p1" } });
  assert.equal(ok.status, 200);
  assert.equal(ok.body.referees.length, 2);
});

test("completed review detail controller covers auth, not-found, and success", () => {
  const unauthorized = createGetCompletedReviewDetailController({
    reviewSubmissionRepository: { getSubmittedReviewById() { return null; }, getAssignmentById() { return null; } }
  }).get({ user: null, params: {} });
  assert.equal(unauthorized.status, 401);

  const notFound = createGetCompletedReviewDetailController({
    reviewSubmissionRepository: {
      getSubmittedReview() {
        return { reviewId: "r1", assignmentId: "a1", status: "submitted", fields: {} };
      },
      getAssignment() {
        return { assignmentId: "a1", editorId: "ed-1", paperId: "p1" };
      }
    }
  }).get({ user: { email: "ed@example.com", role: "editor", id: "ed-1" }, params: { paperId: "other", reviewId: "r1" } });
  assert.equal(notFound.status, 404);

  const success = createGetCompletedReviewDetailController({
    reviewSubmissionRepository: {
      getSubmittedReview() {
        return {
          reviewId: "r2",
          assignmentId: "a2",
          status: "submitted",
          recommendation: "accept",
          comments: "ok",
          fields: { originality: 4 },
          submittedAt: "2026-02-20T00:00:00.000Z"
        };
      },
      getAssignment() {
        return { assignmentId: "a2", editorId: "ed-2", paperId: "p2" };
      }
    }
  }).get({ user: { email: "ed@example.com", role: "editor", id: "ed-2" }, params: { paperId: "p2", reviewId: "r2" } });
  assert.equal(success.status, 200);
  assert.equal(success.body.reviewId, "r2");
});

test("small model constructors cover default and error branches", () => {
  assert.throws(() => asGatewayConfirmationEvent({ attemptId: "a1", gatewayStatus: "bogus" }), /INVALID_GATEWAY_STATUS/);
  const gw = asGatewayConfirmationEvent({ attemptId: "a1", gatewayStatus: "success" });
  assert.equal(gw.gatewayStatus, "success");

  assert.equal(asViewOnlyManuscript(null), null);
  assert.equal(asViewOnlyManuscript({ paperId: "p1", contentUrl: "/m.pdf" }).accessMode, "view_only");

  const p = asPaymentRecord({ attemptId: "a1", registrationId: "r1", gatewayReference: "g1", amount: 10 });
  assert.equal(p.currency, "CAD");

  assert.throws(() => asReconciliationItem({ attemptId: "a1", reason: "wrong" }), /INVALID_RECONCILIATION_REASON/);
  assert.equal(asReconciliationItem({ attemptId: "a1", reason: "confirmation_timeout" }).status, "open");

  assert.equal(asPreGeneratedReviewForm(null), null);
  assert.equal(asPreGeneratedReviewForm({ paperId: "p1", reviewFormId: "f1", preGenerated: 1 }).preGenerated, true);

  assert.equal(asSubmittedReviewRecord(null), null);
  const submitted = asSubmittedReviewRecord({
    reviewId: "r1",
    assignmentId: "a1",
    versionNumber: 2,
    previousReviewId: "r0",
    recommendation: "accept",
    comments: "good",
    fields: { novelty: 4 }
  });
  assert.ok(Object.isFrozen(submitted));
  assert.ok(Object.isFrozen(submitted.fields));

  const pdf = asTicketPdfRecord({ ticketId: "t1", registrationId: "reg1", pdfContent: "base64" });
  assert.equal(pdf.retrievalAvailable, true);

  assert.equal(asCompletedReviewRecord(null, null), null);
  assert.equal(asCompletedReviewRecord({ status: "draft" }, { paperId: "p1" }), null);
  const completed = asCompletedReviewRecord(
    { reviewId: "r1", assignmentId: "a1", status: "submitted", submittedAt: "x", recommendation: "acc", comments: "c", fields: {} },
    { paperId: "p1" }
  );
  assert.equal(completed.paperId, "p1");
});

test("invitation repository handles add/get/remove and duplicate add", () => {
  const repo = new InvitationResponseRepository();
  const now = new Date("2026-02-21T00:00:00.000Z");
  const response = repo.add({ invitationId: "i1", decision: "accept", responderRefereeId: "r1", now });
  assert.equal(response.invitationId, "i1");
  assert.equal(repo.getByInvitation("i1").decision, "accept");
  assert.throws(() => repo.add({ invitationId: "i1", decision: "reject", responderRefereeId: "r1", now }), /ALREADY_RESPONDED/);
  repo.remove("i1");
  assert.equal(repo.getByInvitation("i1"), null);
});

test("schedule model mappers, simple service branches, and validation wrappers", () => {
  assert.equal(asPublishedSchedule({ conferenceId: "c1", status: "published" }).entries.length, 0);
  assert.equal(asScheduleEntry({ entryId: "e1", day: "D1", session: "S1", title: "T", startTime: "09:00", location: "R1" }).entryId, "e1");

  assert.equal(invalidateCurrentSession({ invalidateSession() { return true; } }, null), false);
  assert.equal(invalidateCurrentSession({ invalidateSession() { return true; } }, "sess-1"), true);

  assert.equal(buildFullReviewSection({}).available, false);
  assert.equal(buildFullReviewSection({ fullReviewContent: "Body" }).available, true);

  assert.equal(detectDecisionConflict({ getDecision() { return null; } }, "p1").conflict, false);
  assert.equal(detectDecisionConflict({ getDecision() { return { id: "d1" }; } }, "p1").conflict, true);

  assert.equal(ensureSubmittedReviewReadOnly(null), null);
  assert.equal(ensureSubmittedReviewReadOnly({ id: "r1" }).readOnly, true);

  const validSubmission = validateSubmissionInput(
    {
      author_names: "A",
      author_affiliations: "B",
      author_contact_email: "a@example.com",
      abstract_text: "x",
      keywords: "k",
      main_reference_source: "ref"
    },
    { contentType: "application/pdf", sizeBytes: 1024 }
  );
  assert.equal(validSubmission.valid, true);

  const invalidSubmission = validateSubmissionInput({}, null);
  assert.equal(invalidSubmission.valid, false);

  assert.equal(validateAssignmentVersion({ version: 2 }, undefined).valid, true);
  assert.equal(validateAssignmentVersion({ version: 2 }, 2).valid, true);
  assert.equal(validateAssignmentVersion({ version: 2 }, 1).valid, false);

  assert.equal(validateLoginPayload({ email: "", password: "" }).errors.length, 2);
  assert.equal(validateLoginPayload({ email: " A@B.COM ", password: "x" }).email, "a@b.com");
});

test("assignment transaction and decision persistence cover success and rollback paths", () => {
  const okTransaction = executeAssignmentTransaction({
    assignmentRepository: {
      applyAssignment() {
        return { refereeIds: ["r0"] };
      },
      restoreAssignment() {}
    },
    invitationService: {
      sendInvitations() {}
    },
    paperId: "p1",
    refereeIds: ["r1"],
    now: new Date("2026-02-21T00:00:00.000Z")
  });
  assert.equal(okTransaction.ok, true);

  const persistFail = executeAssignmentTransaction({
    assignmentRepository: {
      applyAssignment() {
        throw new Error("db");
      },
      restoreAssignment() {}
    },
    invitationService: { sendInvitations() {} },
    paperId: "p1",
    refereeIds: ["r1"],
    now: new Date()
  });
  assert.equal(persistFail.ok, false);
  assert.equal(persistFail.code, "ASSIGNMENT_PERSISTENCE_FAILURE");

  let restored = false;
  const inviteFail = executeAssignmentTransaction({
    assignmentRepository: {
      applyAssignment() {
        return { refereeIds: ["r0"] };
      },
      restoreAssignment() {
        restored = true;
      }
    },
    invitationService: {
      sendInvitations() {
        throw new Error("mail");
      }
    },
    paperId: "p1",
    refereeIds: ["r1"],
    now: new Date()
  });
  assert.equal(inviteFail.ok, false);
  assert.equal(inviteFail.code, "ASSIGNMENT_INVITATION_FAILURE");
  assert.equal(restored, true);

  const saveOkRepo = {
    paper: { status: "UNDER_REVIEW" },
    getPaper() {
      return this.paper;
    },
    createDecision() {
      return { decisionId: "d1" };
    }
  };
  assert.equal(
    persistPaperDecision(saveOkRepo, {
      paperId: "p1",
      editorId: "e1",
      outcome: "accept",
      comment: "ok",
      now: new Date("2026-02-21T00:00:00.000Z")
    }).ok,
    true
  );

  const saveFailRepo = {
    paper: { status: "UNDER_REVIEW" },
    getPaper() {
      return this.paper;
    },
    createDecision() {
      const err = new Error("save fail");
      err.code = "WRITE_FAIL";
      throw err;
    }
  };
  const fail = persistPaperDecision(saveFailRepo, {
    paperId: "p1",
    editorId: "e1",
    outcome: "reject",
    comment: "no",
    now: new Date("2026-02-21T00:00:00.000Z")
  });
  assert.equal(fail.ok, false);
  assert.equal(fail.code, "WRITE_FAIL");
  assert.equal(saveFailRepo.paper.status, "UNDER_REVIEW");
});

test("frontend status views return expected fallback and success messages", () => {
  assert.equal(renderValidationResult({ status: 200 }), "Submission saved successfully.");
  assert.equal(renderValidationResult({ status: 422 }), "Please fix highlighted field errors.");
  assert.equal(renderValidationResult({ status: 500 }), "Submission could not be processed.");

  assert.equal(renderRegistrationState({ status: 202 }), "Check your email for a verification link.");
  assert.equal(renderRegistrationState({ status: 422 }), "Please fix the highlighted fields.");
  assert.equal(renderRegistrationState({ status: 500 }), "Registration could not be completed.");
});

test("registration payment state service covers not-found, invalid transition, and success", () => {
  assert.throws(
    () =>
      applyRegistrationPaymentState(
        {
          getRegistration() {
            return null;
          }
        },
        "r1",
        "paid_confirmed"
      ),
    /REGISTRATION_NOT_FOUND/
  );

  const store = {
    reg: { state: "paid_confirmed" },
    getRegistration() {
      return this.reg;
    },
    updateRegistration(_id, patch) {
      this.reg = { ...this.reg, ...patch };
      return this.reg;
    }
  };

  assert.throws(() => applyRegistrationPaymentState(store, "r1", "unpaid"), /INVALID_REGISTRATION_STATE_TRANSITION/);

  store.reg = { state: "unpaid" };
  const updated = applyRegistrationPaymentState(store, "r1", "pending", { gatewayReference: "g1" });
  assert.equal(updated.state, "pending");
  assert.equal(updated.gatewayReference, "g1");
});
