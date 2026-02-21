import test from "node:test";
import assert from "node:assert/strict";

import { UploadTransferService } from "../../backend/src/services/uploads/upload-transfer-service.js";
import { finalizeDraft } from "../../backend/src/services/drafts/finalize-draft-service.js";
import { RefereeWorkloadRetrievalService } from "../../backend/src/services/workload/referee-workload-retrieval-service.js";
import { getCompletedReviewDetail } from "../../backend/src/services/review-view/get-completed-review-detail-service.js";
import { createPostGenerateScheduleController } from "../../backend/src/api/schedule/post-generate-schedule-controller.js";
import { PaperSubmissionRepository } from "../../backend/src/models/paper-submission.js";
import { createPostIssueTicketController } from "../../backend/src/api/tickets/post-issue-ticket-controller.js";
import { createPostPublishScheduleController } from "../../backend/src/api/schedule/post-publish-schedule-controller.js";
import { validateDraftSave, validateFinalize } from "../../backend/src/services/drafts/draft-save-validation-service.js";
import { validateSubmission } from "../../backend/src/services/validation/validation_engine.js";

test("upload transfer service covers callback + default size branches", () => {
  const svc = new UploadTransferService();
  const called = [];
  const res = svc.transfer({
    submissionId: "s1",
    file: { fileName: "m.pdf", sizeBytes: undefined },
    mode: "RESTART",
    resumeOffsetBytes: 0,
    onCheckpoint(offset) {
      called.push(offset);
    }
  });
  assert.equal(res.uploadedBytes, 0);
  assert.equal(called[0], 0);

  const res2 = svc.transfer({
    submissionId: "s2",
    file: { fileName: "m.pdf", sizeBytes: 10 },
    mode: "RESTART",
    resumeOffsetBytes: 0
  });
  assert.equal(res2.uploadedBytes, 10);
});

test("finalize draft + validation services + workload retrieval branches", () => {
  const baseDeps = {
    nowProvider: () => new Date("2026-02-21T00:00:00.000Z"),
    finalizeOrderingObservabilityService: { record() {} }
  };
  {
    const res = finalizeDraft(
      {
        ...baseDeps,
        submissionDraftRepository: { get() { return null; } },
        draftPersistenceService: { persistDraftState() {} },
        saveAttemptRepository: { add() {} }
      },
      { user: null, params: { draftId: "d1" }, body: {} }
    );
    assert.equal(res.status, 401);
  }

  {
    const res = finalizeDraft(
      {
        ...baseDeps,
        submissionDraftRepository: {
          get() {
            return { id: "d1", authorEmail: "a@x.com", status: "DRAFT", stateHash: "", editableState: {}, lastSavedAt: null };
          },
          update() {}
        },
        draftPersistenceService: { persistDraftState() { return { lastSavedAt: "x" }; } },
        saveAttemptRepository: { add() {} }
      },
      { user: { email: "a@x.com" }, params: { draftId: "d1" }, body: { editable_state: {} } }
    );
    assert.equal(res.status, 409);
  }

  assert.equal(validateDraftSave({ contact_email: "bad", title: "ab" }).valid, false);
  assert.equal(validateDraftSave({ contact_email: "ok@x.com", title: "abc" }).valid, true);
  assert.equal(validateFinalize({ title: "", abstract: "" }).valid, false);
  assert.equal(validateFinalize({ title: "T", abstract: "A" }).valid, true);

  const workload = new RefereeWorkloadRetrievalService();
  workload.seed("r1", 2);
  assert.equal(workload.getCurrentWorkload("r1"), 2);
  assert.equal(workload.getCurrentWorkload("missing"), 0);
  workload.increment("r1");
  assert.equal(workload.getCurrentWorkload("r1"), 3);
  workload.failNextRead();
  assert.throws(() => workload.getCurrentWorkload("r1"), /WORKLOAD_RETRIEVAL_FAILURE/);
});

test("review detail service + schedule generate/publish controllers + paper submission + validation engine", () => {
  const retrievalError = getCompletedReviewDetail(
    {
      reviewSubmissionRepository: {
        getSubmittedReview() {
          throw new Error("db");
        }
      }
    },
    { editorId: "ed1", paperId: "p1", reviewId: "r1" }
  );
  assert.equal(retrievalError.outcome, "retrieval_error");

  const generateCtrl = createPostGenerateScheduleController({
    scheduleDraftRepository: {
      getConference() {
        return null;
      }
    },
    roomAvailabilityService() {
      return [];
    },
    scheduleGenerationObservabilityService: { record() {} }
  });
  assert.equal(generateCtrl.post({ user: null, params: { conferenceId: "c1" }, body: {} }).status, 401);
  assert.equal(generateCtrl.post({ user: { email: "a@x.com", role: "author" }, params: { conferenceId: "c1" }, body: {} }).status, 403);

  const publishCtrl = createPostPublishScheduleController({
    scheduleDraftRepository: {
      getDraft() {
        return null;
      },
      publishDraft() {
        return null;
      }
    }
  });
  assert.equal(publishCtrl.post({ user: null, params: {}, body: {} }).status, 401);
  assert.equal(publishCtrl.post({ user: { email: "a@x.com", role: "author" }, params: {}, body: {} }).status, 403);
  assert.equal(publishCtrl.post({ user: { email: "e@x.com", role: "editor" }, params: {}, body: { confirm: false } }).status, 200);
  assert.equal(
    publishCtrl.post({ user: { email: "e@x.com", role: "editor" }, params: { conferenceId: "c1", draftId: "d1" }, body: { confirm: true } }).status,
    404
  );

  const submissionRepo = new PaperSubmissionRepository();
  const now = new Date("2026-02-21T00:00:00.000Z");
  const created = submissionRepo.createDraft({
    authorEmail: "a@x.com",
    metadata: { title: "t" },
    manuscriptFile: null,
    now
  });
  assert.equal(submissionRepo.finalize("missing", now), null);
  assert.equal(submissionRepo.setInterrupted("missing", now), null);
  assert.equal(submissionRepo.attachManuscript("missing", {}, now), null);
  submissionRepo.attachManuscript(created.id, { fileName: "m.pdf" }, now);
  submissionRepo.finalize(created.id, now);
  assert.equal(submissionRepo.listByAuthorEmail("a@x.com").length, 1);

  const definition = {
    requiredFields: ["a", "b"],
    formats: {
      a: (v) => typeof v === "string",
      b: (v) => typeof v === "number"
    },
    businessRules: [
      { field: "b", code: "MIN", message: "b >= 1", validate: (p) => p.b >= 1 }
    ]
  };
  const valid = validateSubmission(definition, { a: "x", b: 2 });
  assert.equal(valid.valid, true);
  const invalid = validateSubmission(definition, { a: "", b: 0 });
  assert.equal(invalid.valid, false);

  const ticketCtrl = createPostIssueTicketController({
    paymentWorkflowStore: {
      getRegistration(id) {
        if (id === "none") return null;
        return { registrationId: id, attendeeId: "u1", state: "paid_confirmed", paymentId: "pay-1" };
      }
    },
    ticketStore: {
      forceDeliveryFailure: false,
      failNextGeneration: true,
      saveTicket() {
        return { ticketId: "t1", ticketReference: "R1" };
      },
      getTicketByRegistrationId() {
        return null;
      },
      savePdf() {}
    },
    ticketObservabilityService: { record() {} }
  });
  assert.equal(ticketCtrl.post({ user: null, params: { registrationId: "r1" } }).status, 401);
  assert.equal(ticketCtrl.post({ user: { id: "u1" }, params: { registrationId: "none" } }).status, 404);
  assert.equal(ticketCtrl.post({ user: { id: "u1" }, params: { registrationId: "r1" } }).status, 500);
});
