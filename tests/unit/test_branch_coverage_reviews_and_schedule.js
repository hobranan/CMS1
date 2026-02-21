import test from "node:test";
import assert from "node:assert/strict";

import { persistScheduleEdit } from "../../backend/src/services/schedule-edit/schedule-edit-persistence-service.js";
import { ReviewSubmissionRepository } from "../../backend/src/models/review-draft.js";
import { createGetSubmittedReviewController } from "../../backend/src/api/reviews/get-submitted-review-controller.js";
import { createGetTicketPdfController } from "../../backend/src/api/tickets/get-ticket-pdf-controller.js";
import { validateUploadCandidate } from "../../backend/src/services/uploads/upload-validation-service.js";
import { createPostSubmitReviewController } from "../../backend/src/api/reviews/post-submit-review-controller.js";
import { projectScheduleDetail } from "../../backend/src/models/schedule-detail-projection.js";
import { createGetReviewDraftController } from "../../backend/src/api/reviews/get-review-draft-controller.js";

test("persistScheduleEdit covers not-found, fail-flag, success, and catch branches", () => {
  {
    const result = persistScheduleEdit(
      {
        getPublished() {
          return null;
        }
      },
      { conferenceId: "c1", editPayload: {} }
    );
    assert.equal(result.status, 404);
  }

  {
    const published = { grid: [], placements: [], conflicts: [], status: "published" };
    const repo = {
      failNextEditSave: true,
      getPublished() {
        return published;
      }
    };
    const result = persistScheduleEdit(repo, { conferenceId: "c1", editPayload: {} });
    assert.equal(result.status, 500);
    assert.equal(repo.failNextEditSave, false);
  }

  {
    const published = { grid: ["old"], placements: ["old"], conflicts: ["old"], status: "draft" };
    const result = persistScheduleEdit(
      {
        getPublished() {
          return published;
        }
      },
      { conferenceId: "c1", editPayload: { grid: ["new-grid"] } }
    );
    assert.equal(result.status, 200);
    assert.deepEqual(result.schedule.grid, ["new-grid"]);
    assert.deepEqual(result.schedule.placements, ["old"]);
    assert.deepEqual(result.schedule.conflicts, ["old"]);
    assert.equal(result.schedule.status, "published");
  }

  {
    const result = persistScheduleEdit(
      {
        getPublished() {
          throw new Error("db");
        }
      },
      { conferenceId: "c1", editPayload: {} }
    );
    assert.equal(result.status, 500);
  }
});

test("ReviewSubmissionRepository covers list/update/version/read branches", () => {
  const repo = new ReviewSubmissionRepository();
  const now = new Date("2026-02-21T00:00:00.000Z");
  repo.seedAssignment({ assignmentId: "a1", refereeId: "r1", editorId: "e1", paperId: "p1" });
  repo.seedAssignment({ assignmentId: "a2", refereeId: "r2", editorId: "e2", paperId: "p2" });

  assert.equal(repo.listAssignmentsByPaper("p1").length, 1);
  assert.equal(repo.listAssignmentsByPaper("none").length, 0);

  assert.equal(repo.updateAssignmentStatus("missing", "inactive"), null);
  assert.equal(repo.updateAssignmentStatus("a1", "inactive").status, "inactive");

  repo.failNextSubmissionWrite();
  assert.throws(
    () =>
      repo.createSubmittedReview({
        assignmentId: "a1",
        refereeId: "r1",
        fields: {},
        recommendation: "accept",
        comments: "",
        now
      }),
    /REVIEW_DB_FAILURE/
  );

  const first = repo.createSubmittedReview({
    assignmentId: "a1",
    refereeId: "r1",
    fields: { originality: 4 },
    recommendation: "accept",
    comments: null,
    now
  });
  const second = repo.createSubmittedReview({
    assignmentId: "a1",
    refereeId: "r1",
    fields: { originality: 5 },
    recommendation: "reject",
    comments: "note",
    now
  });
  assert.equal(first.versionNumber, 1);
  assert.equal(second.versionNumber, 2);
  assert.equal(repo.versionLinks.length, 1);

  repo.failNextSubmissionRead();
  assert.throws(() => repo.getSubmittedReview(second.reviewId), /REVIEW_DB_READ_FAILURE/);
  assert.equal(repo.getSubmittedReview(second.reviewId).reviewId, second.reviewId);

  repo.failNextSubmissionRead();
  assert.throws(() => repo.listSubmittedForAssignment("a1"), /REVIEW_DB_READ_FAILURE/);
});

test("get-submitted-review controller covers auth/not-found/forbidden/success branches", () => {
  const review = { reviewId: "rev-1", assignmentId: "a1", status: "submitted", fields: {} };
  const controller = createGetSubmittedReviewController({
    reviewSubmissionRepository: {
      getSubmittedReview(id) {
        return id === "rev-1" ? review : null;
      },
      getAssignment() {
        return { assignmentId: "a1", refereeId: "r1", editorId: "e1" };
      }
    }
  });

  assert.equal(controller.get({ user: null, params: { reviewId: "rev-1" } }).status, 401);
  assert.equal(controller.get({ user: { email: "x@x.com", role: "referee", id: "r1" }, params: { reviewId: "missing" } }).status, 404);
  assert.equal(controller.get({ user: { email: "x@x.com", role: "referee", id: "r2" }, params: { reviewId: "rev-1" } }).status, 403);
  assert.equal(controller.get({ user: { email: "x@x.com", role: "editor", id: "e2" }, params: { reviewId: "rev-1" } }).status, 403);
  assert.equal(controller.get({ user: { email: "x@x.com", role: "author", id: "a1" }, params: { reviewId: "rev-1" } }).status, 200);
  assert.equal(controller.get({ user: { email: "x@x.com", role: "referee", id: "r1" }, params: { reviewId: "rev-1" } }).status, 200);
});

test("get-ticket-pdf controller covers auth/ownership/notfound/storage/generic/success branches", () => {
  const baseDeps = {
    paymentWorkflowStore: {
      getRegistration(id) {
        if (id === "missing") return null;
        return { registrationId: id, attendeeId: "u1" };
      }
    },
    ticketStore: {
      getPdfByRegistrationId() {
        return { pdfContent: "PDFDATA" };
      }
    }
  };
  const controller = createGetTicketPdfController(baseDeps);
  assert.equal(controller.get({ user: null, params: { registrationId: "r1" } }).status, 401);
  assert.equal(controller.get({ user: { id: "u2" }, params: { registrationId: "r1" } }).status, 404);
  assert.equal(controller.get({ user: { id: "u1" }, params: { registrationId: "missing" } }).status, 404);

  const notFoundController = createGetTicketPdfController({
    ...baseDeps,
    ticketStore: { getPdfByRegistrationId() { return null; } }
  });
  assert.equal(notFoundController.get({ user: { id: "u1" }, params: { registrationId: "r1" } }).status, 404);

  const unavailableController = createGetTicketPdfController({
    ...baseDeps,
    ticketStore: {
      getPdfByRegistrationId() {
        const err = new Error("store");
        err.code = "TICKET_STORAGE_UNAVAILABLE";
        throw err;
      }
    }
  });
  assert.equal(unavailableController.get({ user: { id: "u1" }, params: { registrationId: "r1" } }).status, 503);

  const failedController = createGetTicketPdfController({
    ...baseDeps,
    ticketStore: {
      getPdfByRegistrationId() {
        throw new Error("boom");
      }
    }
  });
  assert.equal(failedController.get({ user: { id: "u1" }, params: { registrationId: "r1" } }).status, 500);

  const success = controller.get({ user: { id: "u1" }, params: { registrationId: "r1" } });
  assert.equal(success.status, 200);
  assert.equal(success.headers["content-type"], "application/pdf");
});

test("upload validation, review submit controller, schedule detail projection and review draft controller", () => {
  {
    const missing = validateUploadCandidate(null);
    assert.equal(missing.errors[0].code, "REQUIRED_FILE");

    const unsupported = validateUploadCandidate({ fileName: "README", sizeBytes: 10 });
    assert.equal(unsupported.extension, "");
    assert.ok(unsupported.errors.some((e) => e.code === "UNSUPPORTED_EXTENSION"));

    const upperOk = validateUploadCandidate({ fileName: "paper.PDF", sizeBytes: 10 });
    assert.equal(upperOk.errors.length, 0);

    const oversize = validateUploadCandidate({ fileName: "paper.pdf", sizeBytes: 8 * 1024 * 1024 });
    assert.ok(oversize.errors.some((e) => e.code === "FILE_TOO_LARGE"));
  }

  {
    const ctrl = createPostSubmitReviewController({
      reviewSubmissionRepository: { getAssignment() { return null; } }
    });
    assert.equal(ctrl.post({ user: null, params: {}, body: {} }).status, 401);
    const cancelled = ctrl.post({ user: { email: "r@x.com", role: "referee", id: "r1" }, params: { assignmentId: "a1" }, body: { confirm_submit: false } });
    assert.equal(cancelled.status, 200);
  }

  {
    const mapped = createPostSubmitReviewController({
      reviewSubmissionRepository: {
        getAssignment() {
          return { assignmentId: "a1", refereeId: "r1", status: "active" };
        },
        createSubmittedReview() {
          return { reviewId: "rev-1", versionNumber: 1, previousReviewId: null };
        },
        updateAssignmentStatus() {}
      },
      reviewNotificationService: { notifyEditor() {} }
    });
    const validationFailure = mapped.post({
      user: { email: "r@x.com", role: "referee", id: "r1" },
      params: { assignmentId: "a1" },
      body: { confirm_submit: true, fields: {}, recommendation: "" }
    });
    assert.equal(validationFailure.status, 400);
    assert.ok(Array.isArray(validationFailure.body.errors));

    const success = mapped.post({
      user: { email: "r@x.com", role: "referee", id: "r1" },
      params: { assignmentId: "a1" },
      body: { confirm_submit: true, fields: { quality: "good" }, recommendation: "accept", comments: "" }
    });
    assert.equal(success.status, 200);
  }

  {
    const hidden = projectScheduleDetail(
      { entryId: "e1", title: "T", speakers: ["S"], abstract: "A" },
      { allowSpeakers: false, allowAbstract: false }
    );
    assert.deepEqual(hidden.unavailableFields.sort(), ["abstract", "speakers"]);

    const visible = projectScheduleDetail(
      { entryId: "e1", title: "T", speakers: ["S"], abstract: "A" },
      { allowSpeakers: true, allowAbstract: true }
    );
    assert.equal(visible.speakers.length, 1);
    assert.equal(visible.abstract, "A");
  }

  {
    const draftController = createGetReviewDraftController({
      reviewSubmissionRepository: {
        getAssignment() {
          return { assignmentId: "a1", refereeId: "r1", deadlineIndicator: "info" };
        },
        getDraft() {
          return null;
        }
      }
    });
    assert.equal(draftController.get({ user: null, params: { assignmentId: "a1" } }).status, 401);
    assert.equal(draftController.get({ user: { email: "r@x.com", role: "referee", id: "r2" }, params: { assignmentId: "a1" } }).status, 403);
    assert.equal(draftController.get({ user: { email: "r@x.com", role: "referee", id: "r1" }, params: { assignmentId: "a1" } }).status, 200);

    const withDraftController = createGetReviewDraftController({
      reviewSubmissionRepository: {
        getAssignment() {
          return { assignmentId: "a1", refereeId: "r1", deadlineIndicator: "info" };
        },
        getDraft() {
          return { requiredFields: { clarity: 5 } };
        }
      }
    });
    assert.equal(
      withDraftController.get({ user: { email: "r@x.com", role: "referee", id: "r1" }, params: { assignmentId: "a1" } }).body.requiredFields.clarity,
      5
    );
  }
});
