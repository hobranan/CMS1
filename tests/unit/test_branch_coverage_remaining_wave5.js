import test from "node:test";
import assert from "node:assert/strict";

import { projectScheduleDetail } from "../../backend/src/models/schedule-detail-projection.js";
import { finalizeDraft } from "../../backend/src/services/drafts/finalize-draft-service.js";
import { validateUploadCandidate } from "../../backend/src/services/uploads/upload-validation-service.js";
import { validateAndPersistSubmission } from "../../backend/src/services/validation/validation_service.js";
import { validateSubmission } from "../../backend/src/services/validation/validation_engine.js";
import { processInvitationResponse } from "../../backend/src/services/invitations/process-invitation-response-service.js";

test("schedule detail projection covers undefined optional fields branches", () => {
  const entry = { entryId: "e1", title: "T" };
  const hidden = projectScheduleDetail(entry, { allowSpeakers: false, allowAbstract: false });
  assert.deepEqual(hidden.speakers, []);
  assert.equal(hidden.abstract, null);

  const visible = projectScheduleDetail(entry, { allowSpeakers: true, allowAbstract: true });
  assert.deepEqual(visible.speakers, []);
  assert.equal(visible.abstract, null);
});

test("finalize draft covers non-200 save passthrough and success without observability", () => {
  const fail = finalizeDraft(
    {
      submissionDraftRepository: { get() { return null; } },
      draftPersistenceService: { persistDraftState() {} },
      saveAttemptRepository: { add() {} }
    },
    { user: null, params: { draftId: "d1" }, body: {} }
  );
  assert.equal(fail.status, 401);

  const repo = {
    get() {
      return { id: "d1", authorEmail: "a@x.com", status: "DRAFT", stateHash: "", editableState: { title: "Title", abstract: "Abstract" } };
    },
    update(_id, fn) {
      const entry = this.get();
      fn(entry);
      return entry;
    }
  };
  const success = finalizeDraft(
    {
      submissionDraftRepository: repo,
      draftPersistenceService: { persistDraftState() { return { lastSavedAt: "x" }; } },
      saveAttemptRepository: { add() {} }
    },
    { user: { email: "a@x.com" }, params: { draftId: "d1" }, body: { editable_state: { title: "Title", abstract: "Abstract" } } }
  );
  assert.equal(success.status, 200);
});

test("upload validation and validation services/engine cover remaining branches", () => {
  const noDot = validateUploadCandidate({ fileName: "README", sizeBytes: 8 * 1024 * 1024 });
  assert.equal(noDot.extension, "");
  assert.ok(noDot.errors.some((e) => e.code === "UNSUPPORTED_EXTENSION"));
  assert.ok(noDot.errors.some((e) => e.code === "FILE_TOO_LARGE"));

  const valid = validateUploadCandidate({ fileName: "paper.tex", sizeBytes: 1024 });
  assert.equal(valid.errors.length, 0);

  const unknown = validateAndPersistSubmission(
    {
      formSubmissionRepository: { recordValidationResult() {} },
      atomicPersistence: { persistAtomically() {} }
    },
    { body: { formId: "missing" } }
  );
  assert.equal(unknown.status, 422);

  const engineValid = validateSubmission(
    { requiredFields: [], formats: undefined, businessRules: undefined },
    {}
  );
  assert.equal(engineValid.valid, true);

  const engineInvalid = validateSubmission(
    {
      requiredFields: ["a"],
      formats: { a: (v) => typeof v === "number" },
      businessRules: [{ field: "a", code: "RULE", message: "must be > 0", validate: (p) => p.a > 0 }]
    },
    { a: 0 }
  );
  assert.equal(engineInvalid.valid, false);
});

test("process invitation response covers conflict/actionable/persist/notify branches", () => {
  const now = new Date("2026-02-21T00:00:00.000Z");
  const baseDeps = {
    reviewInvitationRepository: {
      get() {
        return { invitationId: "i1", refereeId: "r1", paperId: "p1", status: "pending", issuedAt: "2026-02-20T00:00:00.000Z" };
      }
    },
    invitationResponsePersistenceService: { persist() {} },
    invitationNotificationService: { notifyEditor() {} },
    invitationNotificationObservabilityService: { record() {} },
    nowProvider: () => now
  };

  assert.equal(
    processInvitationResponse(baseDeps, { invitationId: "missing", decision: "accept", refereeId: "other" }).status,
    400
  );

  assert.equal(
    processInvitationResponse(baseDeps, {
      invitationId: "i1",
      decision: "accept",
      refereeId: "r1",
      expectedStatus: "accepted"
    }).status,
    409
  );

  const withdrawn = processInvitationResponse(
    {
      ...baseDeps,
      reviewInvitationRepository: {
        get() {
          return { invitationId: "i1", refereeId: "r1", status: "withdrawn", issuedAt: "2026-02-20T00:00:00.000Z" };
        }
      }
    },
    { invitationId: "i1", decision: "accept", refereeId: "r1" }
  );
  assert.equal(withdrawn.status, 400);

  const persistFail = processInvitationResponse(
    {
      ...baseDeps,
      invitationResponsePersistenceService: { persist() { throw new Error("db"); } }
    },
    { invitationId: "i1", decision: "accept", refereeId: "r1" }
  );
  assert.equal(persistFail.status, 500);

  const notifyFail = processInvitationResponse(
    {
      ...baseDeps,
      invitationNotificationService: { notifyEditor() { throw new Error("mail"); } }
    },
    { invitationId: "i1", decision: "reject", refereeId: "r1" }
  );
  assert.equal(notifyFail.status, 200);
  assert.equal(notifyFail.body.notificationStatus, "failed");

  const ok = processInvitationResponse(baseDeps, { invitationId: "i1", decision: "accept", refereeId: "r1" });
  assert.equal(ok.status, 200);
  assert.equal(ok.body.assignmentActive, true);
});
