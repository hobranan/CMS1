import test from "node:test";
import assert from "node:assert/strict";

import {
  loadPendingInvitations,
  submitInvitationDecision,
  cancelInvitationDecision
} from "../../frontend/src/controllers/invitations/invitation-response-controller.js";
import {
  reviewSubmitFailureMessage,
  cancelBeforeSubmit
} from "../../frontend/src/controllers/reviews/review-submit-failure-controller.js";
import { InvitationResponsePersistenceService } from "../../backend/src/services/invitations/invitation-response-persistence-service.js";
import { PaperSubmissionRepository } from "../../backend/src/models/paper-submission.js";
import { ReviewSubmissionRepository } from "../../backend/src/models/review-draft.js";

test("wave14 covers remaining non-app gaps in invitations/reviews/services/models", () => {
  const apiCalls = [];
  const apiClient = (path, payload) => {
    apiCalls.push({ path, payload });
    return { ok: true, path, payload };
  };

  const pending = loadPendingInvitations(apiClient, "ref-1", { id: "u1" });
  assert.equal(pending.ok, true);
  const decidedDefault = submitInvitationDecision(apiClient, "inv-1", "accept", { id: "u1" });
  assert.equal(decidedDefault.ok, true);
  const decidedCustom = submitInvitationDecision(apiClient, "inv-2", "reject", { id: "u1" }, "accepted");
  assert.equal(decidedCustom.ok, true);
  assert.deepEqual(cancelInvitationDecision(), { cancelled: true, mutated: false });
  assert.equal(apiCalls.length, 3);
  assert.equal(apiCalls[1].payload.body.expected_status, "pending");
  assert.equal(apiCalls[2].payload.body.expected_status, "accepted");

  assert.equal(
    reviewSubmitFailureMessage({ status: 200, body: { notificationStatus: "failed" } }),
    "Review submitted, but notification failed."
  );
  assert.equal(reviewSubmitFailureMessage({ status: 500, body: {} }), "Review submission failed. Please retry.");
  assert.equal(reviewSubmitFailureMessage({ status: 200, body: { notificationStatus: "sent" } }), "");
  assert.deepEqual(cancelBeforeSubmit(), { cancelled: true, mutated: false });

  const rows = new Map([
    ["inv-1", { invitationId: "inv-1", status: "pending", refereeId: "ref-1", paperId: "paper-1", responseRecordedAt: null }],
    ["inv-2", { invitationId: "inv-2", status: "pending", refereeId: "ref-1", paperId: "paper-1", responseRecordedAt: null }]
  ]);
  const responseRows = new Map();
  const activation = [];

  const service = new InvitationResponsePersistenceService(
    {
      update(invitationId, mutate) {
        const row = rows.get(invitationId);
        mutate(row);
      }
    },
    {
      add(payload) {
        responseRows.set(payload.invitationId, payload);
        return payload;
      },
      remove(invitationId) {
        responseRows.delete(invitationId);
      }
    },
    {
      activate(payload) {
        activation.push({ type: "activate", payload });
      },
      deactivate(invitationId) {
        activation.push({ type: "deactivate", invitationId });
      }
    }
  );

  const now = new Date("2026-01-01T00:00:00.000Z");
  const accepted = service.persist({ invitation: rows.get("inv-1"), decision: "accept", now });
  assert.equal(accepted.decision, "accept");
  assert.equal(rows.get("inv-1").status, "accepted");

  const rejected = service.persist({ invitation: rows.get("inv-2"), decision: "reject", now });
  assert.equal(rejected.decision, "reject");
  assert.equal(rows.get("inv-2").status, "rejected");

  service.failNextWrite();
  assert.throws(
    () => service.persist({ invitation: rows.get("inv-1"), decision: "accept", now }),
    /INVITATION_DB_FAILURE/
  );

  const rollbackRows = new Map([
    ["inv-rollback", { invitationId: "inv-rollback", status: "pending", refereeId: "ref-1", paperId: "paper-1", responseRecordedAt: null }]
  ]);
  const rollbackResponseRows = new Map();
  const rollbackService = new InvitationResponsePersistenceService(
    {
      update(invitationId, mutate) {
        const row = rollbackRows.get(invitationId);
        mutate(row);
      }
    },
    {
      add(payload) {
        rollbackResponseRows.set(payload.invitationId, payload);
        return payload;
      },
      remove(invitationId) {
        rollbackResponseRows.delete(invitationId);
      }
    },
    {
      activate() {
        throw new Error("ACTIVATION_FAILED");
      },
      deactivate(invitationId) {
        rollbackRows.get(invitationId).deactivated = true;
      }
    }
  );
  assert.throws(
    () => rollbackService.persist({ invitation: rollbackRows.get("inv-rollback"), decision: "accept", now }),
    /ACTIVATION_FAILED/
  );
  assert.equal(rollbackRows.get("inv-rollback").status, "pending");
  assert.equal(rollbackRows.get("inv-rollback").responseRecordedAt, null);
  assert.equal(rollbackRows.get("inv-rollback").deactivated, true);

  const submissionRepo = new PaperSubmissionRepository();
  assert.equal(submissionRepo.getById("missing"), null);
  const draft = submissionRepo.createDraft({
    authorEmail: "author@example.com",
    metadata: { title: "Draft" },
    manuscriptFile: { fileName: "draft.pdf" },
    now
  });
  assert.equal(submissionRepo.listByAuthorEmail("author@example.com").length, 0);
  submissionRepo.finalize(draft.id, now);
  assert.equal(submissionRepo.listByAuthorEmail("author@example.com").length, 1);

  const reviewRepo = new ReviewSubmissionRepository();
  reviewRepo.seedAssignment({ assignmentId: "as-1", refereeId: "ref-1", editorId: "ed-1", paperId: "paper-1" });
  reviewRepo.seedAssignment({ assignmentId: "as-2", refereeId: "ref-2", editorId: "ed-2", paperId: "paper-2" });
  reviewRepo.createSubmittedReview({
    assignmentId: "as-1",
    refereeId: "ref-1",
    fields: { merit: "high" },
    recommendation: "accept",
    comments: "ok",
    now
  });
  const forEditor1 = reviewRepo.listSubmittedForEditor("ed-1");
  const forEditor2 = reviewRepo.listSubmittedForEditor("ed-2");
  assert.equal(forEditor1.length, 1);
  assert.equal(forEditor2.length, 0);
});
