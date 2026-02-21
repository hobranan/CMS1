import test from "node:test";
import assert from "node:assert/strict";

import { uploadAndAttach } from "../../backend/src/services/uploads/upload-attachment-orchestrator.js";
import { saveDraft } from "../../backend/src/services/drafts/save-draft-orchestrator.js";
import { validatePassword, hashPassword, verifyPassword } from "../../backend/src/services/security/password_service.js";
import { validateNewPassword } from "../../backend/src/services/security/password_policy_validator.js";
import { computeEditableStateHash } from "../../backend/src/models/draft-field-state.js";

function createUploadDeps(overrides = {}) {
  const calls = {
    unattached: 0,
    checkpointsCleared: 0,
    attempts: [],
    observability: [],
    associated: 0,
    checkpointsSaved: 0
  };

  const deps = {
    fileAttachmentRecordRepository: {
      setUnattached() {
        calls.unattached += 1;
      }
    },
    uploadObservabilityService: {
      record(event) {
        calls.observability.push(event);
      }
    },
    uploadTransferService: {
      transfer({ onCheckpoint }) {
        onCheckpoint(10);
        onCheckpoint(20);
      }
    },
    uploadProgressStateRepository: {
      saveCheckpoint() {
        calls.checkpointsSaved += 1;
      },
      clearCheckpoint() {
        calls.checkpointsCleared += 1;
      }
    },
    attachmentAssociationService: {
      associate() {
        calls.associated += 1;
      }
    },
    paperSubmissionRepository: {},
    uploadAttemptRepository: {
      add(entry) {
        calls.attempts.push(entry);
      }
    },
    ...overrides
  };

  return { deps, calls };
}

test("uploadAndAttach covers auth/submission/validation failure branches", () => {
  {
    const { deps } = createUploadDeps();
    const res = uploadAndAttach(deps, { user: null, params: {}, body: {}, file: null });
    assert.equal(res.status, 401);
    assert.equal(res.body.code, "AUTH_REQUIRED");
  }

  {
    const { deps } = createUploadDeps();
    const res = uploadAndAttach(deps, { user: { email: "u@example.com" }, params: {}, body: {}, file: null });
    assert.equal(res.status, 400);
    assert.equal(res.body.code, "MISSING_SUBMISSION");
  }

  {
    const { deps, calls } = createUploadDeps();
    const res = uploadAndAttach(deps, {
      user: { email: "u@example.com" },
      params: { submissionId: "sub-1" },
      body: {},
      file: { fileName: "bad.exe", sizeBytes: 1024 }
    });
    assert.equal(res.status, 400);
    assert.equal(res.body.code, "UPLOAD_VALIDATION_FAILED");
    assert.equal(calls.unattached, 1);
    assert.ok(calls.observability.includes("upload_validation_failed"));
  }
});

test("uploadAndAttach covers success and all catch branches", () => {
  {
    const { deps, calls } = createUploadDeps();
    const res = uploadAndAttach(deps, {
      user: { email: "u@example.com" },
      params: { submissionId: "sub-2" },
      body: { mode: "RESUME", resume_offset_bytes: 512, file_fingerprint: "fp-1" },
      file: { fileName: "paper.pdf", sizeBytes: 1024 }
    });
    assert.equal(res.status, 201);
    assert.equal(res.body.status, "ATTACHED");
    assert.equal(calls.checkpointsSaved, 2);
    assert.equal(calls.checkpointsCleared, 1);
    assert.equal(calls.associated, 1);
    assert.equal(calls.attempts.at(-1).outcome, "SUCCESS");
  }

  {
    const { deps, calls } = createUploadDeps({
      uploadTransferService: {
        transfer() {
          const err = new Error("interrupted");
          err.code = "UPLOAD_INTERRUPTED";
          throw err;
        }
      }
    });
    const res = uploadAndAttach(deps, {
      user: { email: "u@example.com" },
      params: { submissionId: "sub-3" },
      body: {},
      file: { fileName: "paper.pdf", sizeBytes: 1024 }
    });
    assert.equal(res.status, 503);
    assert.equal(res.body.code, "UPLOAD_INTERRUPTED");
    assert.equal(calls.attempts.at(-1).outcome, "INTERRUPTED");
  }

  {
    const { deps, calls } = createUploadDeps({
      attachmentAssociationService: {
        associate() {
          const err = new Error("associate");
          err.code = "ASSOCIATION_FAILURE";
          throw err;
        }
      }
    });
    const res = uploadAndAttach(deps, {
      user: { email: "u@example.com" },
      params: { submissionId: "sub-4" },
      body: {},
      file: { fileName: "paper.pdf", sizeBytes: 1024 }
    });
    assert.equal(res.status, 409);
    assert.equal(res.body.code, "ASSOCIATION_FAILED");
    assert.equal(calls.attempts.at(-1).outcome, "ASSOCIATION_FAILURE");
  }

  {
    const { deps, calls } = createUploadDeps({
      uploadTransferService: {
        transfer() {
          const err = new Error("storage");
          err.code = "S3_FAILURE";
          throw err;
        }
      }
    });
    const res = uploadAndAttach(deps, {
      user: { email: "u@example.com" },
      params: { submissionId: "sub-5" },
      body: {},
      file: { fileName: "paper.pdf", sizeBytes: 1024 }
    });
    assert.equal(res.status, 503);
    assert.equal(res.body.code, "UPLOAD_STORAGE_FAILED");
    assert.equal(calls.attempts.at(-1).outcome, "STORAGE_FAILURE");
  }
});

function createDraftDeps(draft, persistBehavior = "success") {
  const attempts = [];
  return {
    nowProvider: () => new Date("2026-02-21T12:00:00.000Z"),
    submissionDraftRepository: {
      get() {
        return draft;
      }
    },
    saveAttemptRepository: {
      add(entry) {
        attempts.push(entry);
      }
    },
    draftPersistenceService: {
      persistDraftState() {
        if (persistBehavior === "network") {
          const err = new Error("network");
          err.code = "NETWORK_FAILURE";
          throw err;
        }
        if (persistBehavior === "system") {
          const err = new Error("system");
          err.code = "OTHER";
          throw err;
        }
        return { lastSavedAt: "2026-02-21T12:00:00.000Z" };
      }
    },
    attempts
  };
}

test("saveDraft covers auth/not-found/finalized/validation/no-change/saved/system errors", () => {
  {
    const deps = createDraftDeps(null);
    const res = saveDraft(deps, { user: null, params: { draftId: "d1" }, body: {} });
    assert.equal(res.status, 401);
  }

  {
    const deps = createDraftDeps(null);
    const res = saveDraft(deps, { user: { email: "a@example.com" }, params: { draftId: "d1" }, body: {} });
    assert.equal(res.status, 404);
  }

  {
    const deps = createDraftDeps({ authorEmail: "a@example.com", status: "FINALIZED" });
    const res = saveDraft(deps, {
      user: { email: "a@example.com" },
      params: { draftId: "d1" },
      body: { editable_state: {} }
    });
    assert.equal(res.status, 409);
  }

  {
    const deps = createDraftDeps({
      authorEmail: "a@example.com",
      status: "DRAFT",
      stateHash: "h1",
      lastSavedAt: "2026-02-20T00:00:00.000Z"
    });
    const res = saveDraft(deps, {
      user: { email: "a@example.com" },
      params: { draftId: "d1" },
      body: { editable_state: { contact_email: "bad-email" } }
    });
    assert.equal(res.status, 400);
    assert.equal(res.body.status, "VALIDATION_FAILED");
  }

  {
    const deps = createDraftDeps({
      authorEmail: "a@example.com",
      status: "DRAFT",
      stateHash: computeEditableStateHash({}),
      lastSavedAt: "2026-02-20T00:00:00.000Z"
    });
    const res = saveDraft(deps, {
      user: { email: "a@example.com" },
      params: { draftId: "d1" },
      body: { editable_state: {} }
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.status, "NO_CHANGES");
  }

  {
    const deps = createDraftDeps({
      authorEmail: "a@example.com",
      status: "DRAFT",
      stateHash: "old",
      lastSavedAt: "2026-02-20T00:00:00.000Z"
    });
    const res = saveDraft(deps, {
      user: { email: "a@example.com" },
      params: { draftId: "d1" },
      body: { editable_state: { title: "New title" } }
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.status, "SAVED");
  }

  {
    const deps = createDraftDeps(
      { authorEmail: "a@example.com", status: "DRAFT", stateHash: "old", lastSavedAt: "x" },
      "network"
    );
    const res = saveDraft(deps, {
      user: { email: "a@example.com" },
      params: { draftId: "d1" },
      body: { editable_state: { title: "New title" } }
    });
    assert.equal(res.status, 503);
    assert.equal(res.body.code, "NETWORK_FAILURE");
  }

  {
    const deps = createDraftDeps(
      { authorEmail: "a@example.com", status: "DRAFT", stateHash: "old", lastSavedAt: "x" },
      "system"
    );
    const res = saveDraft(deps, {
      user: { email: "a@example.com" },
      params: { draftId: "d1" },
      body: { editable_state: { title: "New title" } }
    });
    assert.equal(res.status, 503);
    assert.equal(res.body.code, "SYSTEM_FAILURE");
  }
});

test("password service and policy validator cover remaining branch combinations", () => {
  assert.equal(verifyPassword("x", null), false);
  assert.equal(verifyPassword("x", "invalid-hash-format"), false);

  const hash = hashPassword("StrongerPass!123");
  assert.equal(verifyPassword("StrongerPass!123", hash), true);
  assert.equal(verifyPassword("StrongerPass!124", hash), false);

  const edgeSpace = validatePassword(" password123 ");
  assert.ok(edgeSpace.some((e) => e.code === "PASSWORD_HAS_EDGE_SPACES"));
  assert.ok(edgeSpace.some((e) => e.code === "PASSWORD_MISSING_UPPERCASE"));

  const common = validatePassword("password123");
  assert.ok(common.some((e) => e.code === "PASSWORD_COMMON_OR_BREACHED"));

  const strong = validatePassword("SuperStrong!Pass123");
  assert.equal(strong.length, 0);

  const relaxedConfig = {
    minLength: 4,
    requireUpper: false,
    requireLower: false,
    requireNumber: false,
    requireSpecial: false,
    forbidSpaces: false
  };
  const relaxed = validateNewPassword({
    newPassword: "    ",
    currentPassword: "abc",
    currentPasswordHash: null,
    recentHistoryHashes: null,
    config: relaxedConfig
  });
  assert.equal(relaxed.length, 0);
});
