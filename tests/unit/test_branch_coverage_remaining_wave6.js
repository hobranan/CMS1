import test from "node:test";
import assert from "node:assert/strict";

import { changePassword } from "../../backend/src/services/account/password_change_service.js";
import { finalizeRefereeAssignment } from "../../backend/src/services/assignments/finalize-referee-assignment-service.js";
import { login } from "../../backend/src/services/auth/login_service.js";
import { processPaperDecision } from "../../backend/src/services/decisions/process-paper-decision-service.js";
import { createRegistration } from "../../backend/src/services/registration/registration_service.js";
import { resendVerification } from "../../backend/src/services/registration/resend_verification_service.js";
import { validatePassword } from "../../backend/src/services/security/password_service.js";
import { UploadTransferService } from "../../backend/src/services/uploads/upload-transfer-service.js";
import { validateUploadCandidate } from "../../backend/src/services/uploads/upload-validation-service.js";
import { validateAndPersistSubmission } from "../../backend/src/services/validation/validation_service.js";

test("wave6 covers fallback branches in account/assignment/auth/decision/registration services", () => {
  const pw = changePassword(
    {
      credentialRepository: { getUserByEmail() { return null; } },
      passwordHistoryRepository: { getRecentHashes() { return []; } },
      sessionService: {}
    },
    { user: null, body: {} }
  );
  assert.equal(pw.status, 401);

  const assign = finalizeRefereeAssignment(
    {
      paperRefereeAssignmentRepository: { getPaper() { return null; } },
      reviewInvitationService: {}
    },
    { paperId: "p-missing", refereeIds: ["r1"], expectedVersion: 1 }
  );
  assert.equal(assign.status, 404);

  const lockoutStateRepository = {
    states: new Map(),
    getState(email) {
      return this.states.get(email) ?? { failedAttemptCount: 0, lockoutExpiresAt: null };
    },
    setState(email, state) {
      this.states.set(email, state);
    }
  };
  const auth = login(
    {
      repository: {
        findActiveUserByEmail() {
          return null;
        },
        findPendingByEmail() {
          return null;
        }
      },
      lockoutStateRepository
    },
    { body: { email: "nobody@example.com", password: "bad" } }
  );
  assert.equal(auth.status, 401);

  const decision = processPaperDecision(
    {
      paperDecisionRepository: {
        getPaper() {
          return {
            id: "p1",
            editorId: "e1",
            status: "under_review",
            decisionPeriodOpen: true,
            completedReviewCount: 1
          };
        },
        getDecision() {
          return { decisionId: "d-1" };
        }
      },
      paperDecisionNotificationService: { notifyAuthors() {} }
    },
    { paperId: "p1", editorId: "e1", outcome: "accept", comment: "ok", confirm: true }
  );
  assert.equal(decision.status, 409);

  const reg = createRegistration(
    {
      repository: {
        findActiveUserByEmail() {
          return null;
        },
        findPendingByEmail() {
          return null;
        },
        acquireLock() {
          return true;
        },
        releaseLock() {},
        createPendingRegistration() {
          return {};
        },
        saveVerificationToken() {}
      },
      verificationEmailService: { sendVerificationEmail() {} }
    },
    {}
  );
  assert.equal(reg.status, 422);

  const resend = resendVerification(
    {
      repository: {
        findPendingByEmail() {
          return null;
        }
      },
      verificationEmailService: { sendVerificationEmail() {} }
    },
    { body: { email: "missing@example.com" } }
  );
  assert.equal(resend.status, 404);
});

test("wave6 covers password/upload/validation nullish + optional branches", () => {
  const pwErrors = validatePassword(undefined);
  assert.ok(pwErrors.some((e) => e.code === "PASSWORD_MISSING_LOWERCASE"));

  const transfer = new UploadTransferService();
  transfer.failNextWithInterruption();
  assert.throws(
    () => transfer.transfer({ submissionId: "s1", file: { fileName: "paper.pdf" }, mode: "new" }),
    (error) => error.code === "UPLOAD_INTERRUPTED"
  );

  const upload = validateUploadCandidate({});
  assert.equal(upload.extension, "");
  assert.ok(upload.errors.some((e) => e.code === "UNSUPPORTED_EXTENSION"));

  const unknown = validateAndPersistSubmission(
    {
      formSubmissionRepository: { recordValidationResult() {} },
      atomicPersistence: { persistAtomically() {} }
    },
    {}
  );
  assert.equal(unknown.status, 422);

  const valid = validateAndPersistSubmission(
    {
      formSubmissionRepository: { recordValidationResult() {} },
      atomicPersistence: {
        persistAtomically({ recordId }) {
          return { recordId };
        }
      }
    },
    { body: { formId: "profile_form", operation: "save" } }
  );
  assert.equal(valid.status, 422);
});
