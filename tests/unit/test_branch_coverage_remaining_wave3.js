import test from "node:test";
import assert from "node:assert/strict";

import { validateNewPassword } from "../../backend/src/services/security/password_policy_validator.js";
import { finalizeSubmission } from "../../backend/src/services/submissions/submission-finalization-service.js";
import { createGetAssignedPapersController } from "../../backend/src/api/assigned-access/get-assigned-papers-controller.js";
import { createPostInvitationResponseController } from "../../backend/src/api/invitations/post-invitation-response-controller.js";
import { createPostPaperDecisionController } from "../../backend/src/api/decisions/post-paper-decision-controller.js";
import { getCompletedReviewDetail } from "../../backend/src/services/review-view/get-completed-review-detail-service.js";
import { UploadTransferService } from "../../backend/src/services/uploads/upload-transfer-service.js";
import { ReviewInvitationRepository } from "../../backend/src/models/review-invitation.js";
import { retrievePublicEntryDetail } from "../../backend/src/services/public-schedule/public-schedule-detail-service.js";
import { computeEditableStateHash } from "../../backend/src/models/draft-field-state.js";

test("password policy validator covers lowercase and spaces branches", () => {
  const cfg = {
    minLength: 3,
    requireUpper: false,
    requireLower: true,
    requireNumber: false,
    requireSpecial: false,
    forbidSpaces: true
  };
  const noLower = validateNewPassword({
    newPassword: "UPPER123!",
    currentPassword: "old",
    currentPasswordHash: null,
    recentHistoryHashes: [],
    config: cfg
  });
  assert.ok(noLower.some((e) => e.code === "PASSWORD_MISSING_LOWERCASE"));

  const hasSpaces = validateNewPassword({
    newPassword: "Has space",
    currentPassword: "old",
    currentPasswordHash: null,
    recentHistoryHashes: [],
    config: cfg
  });
  assert.ok(hasSpaces.some((e) => e.code === "PASSWORD_CONTAINS_SPACES"));
});

test("submission finalization and assigned papers controllers cover remaining branches", () => {
  const finalDeps = {
    submissionPersistenceService: {
      saveFinalizedSubmission() {
        return { id: "sub-1", status: "FINALIZED", metadata: {}, manuscriptFile: {} };
      }
    },
    submissionObservabilityService: { record() {} }
  };
  assert.equal(finalizeSubmission(finalDeps, { user: null, body: {}, file: null }).status, 401);
  assert.equal(finalizeSubmission(finalDeps, { user: { email: "a@x.com" }, body: {}, file: null }).status, 400);

  const failDeps = {
    ...finalDeps,
    submissionPersistenceService: {
      saveFinalizedSubmission() {
        throw new Error("store");
      }
    }
  };
  assert.equal(
    finalizeSubmission(failDeps, {
      user: { email: "a@x.com" },
      body: {
        author_names: "A",
        author_affiliations: "B",
        author_contact_email: "a@x.com",
        abstract_text: "abs",
        keywords: "k",
        main_reference_source: "r"
      },
      file: { contentType: "application/pdf", sizeBytes: 1000, fileName: "m.pdf" }
    }).status,
    503
  );

  const assignedCtrl = createGetAssignedPapersController({
    assignedPaperRepository: {
      listAssigned() {
        return [];
      }
    }
  });
  assert.equal(assignedCtrl.get({ user: null, params: { refereeId: "r1" } }).status, 401);
  assert.equal(assignedCtrl.get({ user: { email: "r@x.com", role: "referee", id: "r2" }, params: { refereeId: "r1" } }).status, 401);
  assert.equal(assignedCtrl.get({ user: { email: "r@x.com", role: "referee", id: "r1" }, params: { refereeId: "r1" } }).status, 200);
  const errCtrl = createGetAssignedPapersController({
    assignedPaperRepository: {
      listAssigned() {
        throw new Error("x");
      }
    }
  });
  assert.equal(errCtrl.get({ user: { email: "r@x.com", role: "referee", id: "r1" }, params: { refereeId: "r1" } }).status, 500);
});

test("invitation/decision controllers and detail service cover mapping branches", () => {
  const invitationCtrl = createPostInvitationResponseController({});
  assert.equal(invitationCtrl.post({ user: null, params: {}, body: {} }).status, 401);
  assert.equal(invitationCtrl.post({ user: { email: "r@x.com", role: "referee", id: "r1" }, params: {}, body: { decision: "maybe" } }).status, 400);

  const invitationMapped = createPostInvitationResponseController({
    reviewInvitationRepository: {
      get() {
        return { invitationId: "i1", refereeId: "r1", paperId: "p1", status: "pending", issuedAt: "2026-02-20T00:00:00.000Z" };
      }
    },
    invitationResponsePersistenceService: {
      persist() {}
    },
    invitationNotificationService: {
      notifyEditor() {
        throw new Error("mail");
      }
    },
    invitationNotificationObservabilityService: { record() {} },
    nowProvider: () => new Date("2026-02-21T00:00:00.000Z")
  });
  const mapped200 = invitationMapped.post({
    user: { email: "r@x.com", role: "referee", id: "r1" },
    params: { invitationId: "i1" },
    body: { decision: "accept", expected_status: "pending" }
  });
  assert.equal(mapped200.status, 200);
  assert.equal(mapped200.body.notificationStatus, "failed");

  const decisionCtrl = createPostPaperDecisionController({});
  assert.equal(decisionCtrl.post({ user: null, params: {}, body: {} }).status, 401);
  assert.equal(decisionCtrl.post({ user: { email: "e@x.com", role: "editor", id: "e1" }, params: {}, body: { outcome: "maybe" } }).status, 422);

  const detailUnauthorized = getCompletedReviewDetail(
    {
      reviewSubmissionRepository: {
        getSubmittedReview() {
          return { reviewId: "r1", assignmentId: "a1", status: "submitted" };
        },
        getAssignment() {
          return { assignmentId: "a1", editorId: "other", paperId: "p1" };
        }
      }
    },
    { editorId: "ed-1", paperId: "p1", reviewId: "r1" }
  );
  assert.equal(detailUnauthorized.outcome, "unauthorized");

  const detailMismatch = getCompletedReviewDetail(
    {
      reviewSubmissionRepository: {
        getSubmittedReview() {
          return { reviewId: "r1", assignmentId: "a1", status: "submitted", submittedAt: "x", recommendation: "a", comments: "c", fields: {} };
        },
        getAssignment() {
          return { assignmentId: "a1", editorId: "ed-1", paperId: "p2" };
        }
      }
    },
    { editorId: "ed-1", paperId: "p1", reviewId: "r1" }
  );
  assert.equal(detailMismatch.outcome, "review_not_found");
});

test("upload transfer, invitation repo, public detail, and draft hash cover remaining branches", () => {
  const transfer = new UploadTransferService();
  transfer.failNextWithInterruption();
  assert.throws(
    () =>
      transfer.transfer({
        submissionId: "s1",
        file: { fileName: "m.pdf", sizeBytes: 100 },
        mode: "RESTART",
        resumeOffsetBytes: 0
      }),
    /Upload interrupted/
  );
  transfer.failNextWithStorageFailure();
  assert.throws(
    () =>
      transfer.transfer({
        submissionId: "s1",
        file: { fileName: "m.pdf", sizeBytes: 100 },
        mode: "RESTART",
        resumeOffsetBytes: 0
      }),
    /Storage unavailable/
  );
  const ok = transfer.transfer({
    submissionId: "s1",
    file: { fileName: "m.pdf", sizeBytes: 100 },
    mode: "RESUME",
    resumeOffsetBytes: 10
  });
  assert.equal(ok.uploadedBytes, 100);

  const inv = new ReviewInvitationRepository();
  const row = inv.create({ paperId: "p1", refereeId: "r1", issuedAt: "2026-02-01T00:00:00.000Z" });
  assert.equal(inv.get("missing"), null);
  assert.equal(inv.update("missing", () => {}), null);
  assert.equal(inv.update(row.invitationId, (r) => { r.status = "accepted"; }).status, "accepted");
  assert.equal(inv.listByReferee("r1").length, 1);

  const pubRepo = {
    getPublished() {
      return {
        entries: [{ entryId: "e1", title: "T", speakers: ["S"], abstract: "A" }]
      };
    },
    failNextPublicEntryRead: false
  };
  assert.equal(retrievePublicEntryDetail({ ...pubRepo, getPublished() { return null; } }, "c1", "e1", { allowSpeakers: true, allowAbstract: true }).status, 404);
  const failRepo = { ...pubRepo, failNextPublicEntryRead: true };
  assert.equal(retrievePublicEntryDetail(failRepo, "c1", "e1", { allowSpeakers: true, allowAbstract: true }).status, 500);
  assert.equal(retrievePublicEntryDetail(pubRepo, "c1", "missing", { allowSpeakers: true, allowAbstract: true }).status, 404);
  assert.equal(retrievePublicEntryDetail(pubRepo, "c1", "e1", { allowSpeakers: false, allowAbstract: false }).status, 200);

  assert.equal(computeEditableStateHash(null).length, 64);
  assert.equal(computeEditableStateHash({ b: 1, a: 2 }), computeEditableStateHash({ a: 2, b: 1 }));
});
