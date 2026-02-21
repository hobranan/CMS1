import test from "node:test";
import assert from "node:assert/strict";

import { normalizeMetadata, validateMetadata } from "../../backend/src/models/paper-metadata.js";
import { asPublicAnnouncement } from "../../backend/src/models/public-announcement.js";
import { asRegistrationPaymentAttempt } from "../../backend/src/models/registration-payment-attempt.js";
import { loadScheduleInputs } from "../../backend/src/services/schedule/schedule-input-loader.js";
import { resendVerification } from "../../backend/src/services/registration/resend_verification_service.js";
import { finalizeDraft } from "../../backend/src/services/drafts/finalize-draft-service.js";
import { renderLoginState } from "../../frontend/src/views/login_view.js";
import { submitManuscriptUpload } from "../../frontend/src/controllers/upload/manuscript-upload-controller.js";

class InMemoryDraftRepo {
  constructor(entries = {}) {
    this.store = new Map(Object.entries(entries));
  }

  get(id) {
    return this.store.get(id);
  }

  update(id, updater) {
    const current = this.store.get(id);
    if (!current) return null;
    updater(current);
    return current;
  }
}

test("normalizeMetadata trims fields and lowercases contact email", () => {
  const normalized = normalizeMetadata({
    author_names: "  Jane Doe  ",
    author_affiliations: "  University X ",
    author_contact_email: "  USER@EXAMPLE.COM ",
    author_contact_phone: " +1 (617) 555-1212 ",
    abstract_text: "  abstract ",
    keywords: "  testing,coverage ",
    main_reference_source: "  IEEE "
  });

  assert.equal(normalized.authorNames, "Jane Doe");
  assert.equal(normalized.authorAffiliations, "University X");
  assert.equal(normalized.authorContactEmail, "user@example.com");
  assert.equal(normalized.authorContactPhone, "+1 (617) 555-1212");
  assert.equal(normalized.abstractText, "abstract");
  assert.equal(normalized.keywords, "testing,coverage");
  assert.equal(normalized.mainReferenceSource, "IEEE");
});

test("validateMetadata returns required and format errors for invalid payload", () => {
  const result = validateMetadata(
    normalizeMetadata({
      author_names: "",
      author_affiliations: "",
      author_contact_email: "bad-email",
      abstract_text: "",
      keywords: " ",
      main_reference_source: ""
    })
  );

  assert.ok(result.errors.some((e) => e.field === "author_names" && e.code === "REQUIRED"));
  assert.ok(result.errors.some((e) => e.field === "author_affiliations" && e.code === "REQUIRED"));
  assert.ok(result.errors.some((e) => e.field === "author_contact_email" && e.code === "INVALID_EMAIL"));
  assert.ok(result.errors.some((e) => e.field === "abstract_text" && e.code === "REQUIRED"));
  assert.ok(result.errors.some((e) => e.field === "keywords" && e.code === "REQUIRED"));
  assert.ok(result.errors.some((e) => e.field === "main_reference_source" && e.code === "REQUIRED"));
});

test("validateMetadata handles phone variants: absent, invalid chars, invalid length, valid", () => {
  const noPhone = validateMetadata(
    normalizeMetadata({
      author_names: "A",
      author_affiliations: "B",
      author_contact_email: "a@b.com",
      abstract_text: "x",
      keywords: "y",
      main_reference_source: "z"
    })
  );
  assert.equal(noPhone.normalizedPhone, null);

  const invalidChars = validateMetadata(
    normalizeMetadata({
      author_names: "A",
      author_affiliations: "B",
      author_contact_email: "a@b.com",
      author_contact_phone: "abc123",
      abstract_text: "x",
      keywords: "y",
      main_reference_source: "z"
    })
  );
  assert.ok(invalidChars.errors.some((e) => e.field === "author_contact_phone" && e.code === "INVALID_PHONE"));

  const invalidLength = validateMetadata(
    normalizeMetadata({
      author_names: "A",
      author_affiliations: "B",
      author_contact_email: "a@b.com",
      author_contact_phone: "12",
      abstract_text: "x",
      keywords: "y",
      main_reference_source: "z"
    })
  );
  assert.ok(invalidLength.errors.some((e) => e.field === "author_contact_phone" && e.code === "INVALID_PHONE"));

  const validPhone = validateMetadata(
    normalizeMetadata({
      author_names: "A",
      author_affiliations: "B",
      author_contact_email: "a@b.com",
      author_contact_phone: "+1 (617) 555-1212",
      abstract_text: "x",
      keywords: "y",
      main_reference_source: "z"
    })
  );
  assert.equal(validPhone.normalizedPhone, "16175551212");
});

test("asPublicAnnouncement applies defaults and explicit overrides", () => {
  const withDefaults = asPublicAnnouncement({
    announcementId: "A1",
    title: "Announcement",
    content: "Body"
  });
  assert.equal(withDefaults.summary, null);
  assert.equal(withDefaults.isPublic, true);
  assert.equal(withDefaults.isAvailable, true);
  assert.ok(typeof withDefaults.publishedAt === "string");

  const overridden = asPublicAnnouncement({
    announcementId: "A2",
    title: "Announcement 2",
    summary: "Summary",
    content: "Body 2",
    publishedAt: "2026-01-01T00:00:00.000Z",
    isPublic: false,
    isAvailable: false
  });
  assert.equal(overridden.summary, "Summary");
  assert.equal(overridden.publishedAt, "2026-01-01T00:00:00.000Z");
  assert.equal(overridden.isPublic, false);
  assert.equal(overridden.isAvailable, false);
});

test("asRegistrationPaymentAttempt validates status and applies defaults", () => {
  assert.throws(
    () =>
      asRegistrationPaymentAttempt({
        attendeeId: "u1",
        registrationId: "r1",
        categoryId: "c1",
        amount: 100,
        status: "unexpected_status"
      }),
    /INVALID_PAYMENT_ATTEMPT_STATUS/
  );

  const defaulted = asRegistrationPaymentAttempt({
    attendeeId: "u1",
    registrationId: "r1",
    categoryId: "c1",
    amount: 100
  });
  assert.equal(defaulted.status, "initiated");
  assert.equal(defaulted.currency, "CAD");
  assert.equal(defaulted.gatewayReference, null);
  assert.ok(typeof defaulted.attemptId === "string");
  assert.ok(typeof defaulted.createdAt === "string");

  const explicit = asRegistrationPaymentAttempt({
    attemptId: "att-1",
    attendeeId: "u2",
    registrationId: "r2",
    categoryId: "c2",
    amount: 150,
    currency: "USD",
    status: "confirmed",
    gatewayReference: "gw-1",
    createdAt: "2026-02-21T00:00:00.000Z"
  });
  assert.equal(explicit.attemptId, "att-1");
  assert.equal(explicit.status, "confirmed");
  assert.equal(explicit.currency, "USD");
  assert.equal(explicit.gatewayReference, "gw-1");
});

test("loadScheduleInputs handles missing conference and populated conference", () => {
  const repo = {
    getConference(id) {
      if (id === "missing") return null;
      return {
        id,
        acceptedPapers: [{ id: "p1" }],
        rooms: [{ id: "r1" }],
        parameters: { slotMinutes: 20 }
      };
    }
  };

  const missing = loadScheduleInputs(repo, "missing");
  assert.equal(missing.conference, null);
  assert.deepEqual(missing.acceptedPapers, []);
  assert.deepEqual(missing.rooms, []);
  assert.deepEqual(missing.parameters, {});

  const present = loadScheduleInputs(repo, "c1");
  assert.equal(present.conference.id, "c1");
  assert.equal(present.acceptedPapers.length, 1);
  assert.equal(present.rooms.length, 1);
  assert.equal(present.parameters.slotMinutes, 20);
});

test("resendVerification returns not-found, expired, ineligible, rate-limited, cooldown, and success", () => {
  const now = new Date("2026-02-21T12:00:00.000Z");
  const baseConfig = {
    verificationTokenTtlHours: 24,
    resendWindowHours: 24,
    resendMaxAttempts: 3,
    resendCooldownSeconds: 60
  };

  const mkDeps = (pending) => {
    const sent = [];
    const markedExpired = [];
    const audits = [];
    return {
      deps: {
        config: baseConfig,
        nowProvider: () => now,
        repository: {
          findPendingByEmail() {
            return pending;
          },
          invalidateActiveTokens() {},
          saveVerificationToken() {},
          markPendingExpired(email) {
            markedExpired.push(email);
          }
        },
        verificationEmailService: {
          sendVerificationEmail(payload) {
            sent.push(payload);
          }
        },
        auditLog: {
          record(event, payload) {
            audits.push({ event, payload });
          }
        }
      },
      sent,
      markedExpired,
      audits
    };
  };

  {
    const { deps } = mkDeps(null);
    const result = resendVerification(deps, { body: { email: "none@example.com" } });
    assert.equal(result.status, 404);
  }

  {
    const pending = {
      email: "old@example.com",
      status: "PENDING_VERIFICATION",
      registrationExpiresAt: "2026-02-13T00:00:00.000Z",
      resendAttempts: []
    };
    const { deps, markedExpired } = mkDeps(pending);
    const result = resendVerification(deps, { body: { email: "old@example.com" } });
    assert.equal(result.status, 410);
    assert.equal(markedExpired.length, 1);
  }

  {
    const pending = {
      email: "done@example.com",
      status: "VERIFIED",
      registrationExpiresAt: "2026-02-28T00:00:00.000Z",
      resendAttempts: []
    };
    const { deps } = mkDeps(pending);
    const result = resendVerification(deps, { body: { email: "done@example.com" } });
    assert.equal(result.status, 410);
  }

  {
    const pending = {
      email: "limited@example.com",
      status: "PENDING_VERIFICATION",
      registrationExpiresAt: "2026-02-28T00:00:00.000Z",
      resendAttempts: [
        "2026-02-21T09:00:00.000Z",
        "2026-02-21T10:00:00.000Z",
        "2026-02-21T11:00:00.000Z"
      ]
    };
    const { deps } = mkDeps(pending);
    const result = resendVerification(deps, { body: { email: "limited@example.com" } });
    assert.equal(result.status, 429);
    assert.equal(result.body.code, "RESEND_RATE_LIMITED");
  }

  {
    const pending = {
      email: "cooldown@example.com",
      status: "PENDING_VERIFICATION",
      registrationExpiresAt: "2026-02-28T00:00:00.000Z",
      resendAttempts: ["2026-02-21T11:59:30.000Z"]
    };
    const { deps } = mkDeps(pending);
    const result = resendVerification(deps, { body: { email: "cooldown@example.com" } });
    assert.equal(result.status, 429);
    assert.equal(result.body.code, "RESEND_COOLDOWN_ACTIVE");
  }

  {
    const pending = {
      id: "pending-1",
      email: "ok@example.com",
      status: "PENDING_VERIFICATION",
      registrationExpiresAt: "2026-02-28T00:00:00.000Z",
      resendAttempts: ["2026-02-20T08:00:00.000Z"]
    };
    const { deps, sent, audits } = mkDeps(pending);
    const result = resendVerification(deps, { body: { email: "OK@EXAMPLE.COM" } });
    assert.equal(result.status, 202);
    assert.equal(result.body.status, "PENDING_VERIFICATION");
    assert.equal(sent.length, 1);
    assert.equal(audits.length, 1);
    assert.equal(pending.resendAttempts.length, 1);
    assert.equal(pending.resendAttempts[0], now.toISOString());
  }
});

test("finalizeDraft returns save error, final-validation failure, and finalized success", () => {
  const draftRepo = new InMemoryDraftRepo({
    d1: {
      id: "d1",
      authorEmail: "author@example.com",
      status: "DRAFT",
      stateHash: "old-hash",
      editableState: { title: "Old", abstract: "Old abstract" },
      lastSavedAt: "2026-02-20T00:00:00.000Z"
    }
  });

  const deps = {
    nowProvider: () => new Date("2026-02-21T12:00:00.000Z"),
    submissionDraftRepository: draftRepo,
    saveAttemptRepository: { add() {} },
    draftPersistenceService: {
      persistDraftState({ draftId, editableState, stateHash, now }) {
        draftRepo.update(draftId, (entry) => {
          entry.editableState = editableState;
          entry.stateHash = stateHash;
          entry.lastSavedAt = now.toISOString();
        });
        return { lastSavedAt: now.toISOString() };
      }
    },
    finalizeOrderingObservabilityService: { record() {} }
  };

  {
    const result = finalizeDraft(deps, {
      params: { draftId: "d1" },
      body: { editable_state: { title: "No auth attempt" } },
      user: null
    });
    assert.equal(result.status, 401);
  }

  {
    const result = finalizeDraft(deps, {
      params: { draftId: "d1" },
      body: { editable_state: { title: "Updated only title" } },
      user: { email: "author@example.com" }
    });
    assert.equal(result.status, 409);
    assert.equal(result.body.code, "FINAL_VALIDATION_FAILED");
    assert.equal(result.body.draft_saved, true);
  }

  {
    const result = finalizeDraft(deps, {
      params: { draftId: "d1" },
      body: { editable_state: { title: "Updated title", abstract: "Updated abstract" } },
      user: { email: "author@example.com" }
    });
    assert.equal(result.status, 200);
    assert.equal(result.body.status, "FINALIZED");
    assert.equal(draftRepo.get("d1").status, "FINALIZED");
  }
});

test("renderLoginState covers all status branches", () => {
  assert.equal(renderLoginState({ status: 200, body: {} }), "Login successful.");
  assert.equal(
    renderLoginState({ status: 403, body: { code: "EMAIL_UNVERIFIED" } }),
    "Verify your email before login. Resend is available."
  );
  assert.equal(renderLoginState({ status: 400, body: {} }), "Email and password are required.");
  assert.equal(renderLoginState({ status: 423, body: {} }), "Account is temporarily locked.");
  assert.equal(renderLoginState({ status: 503, body: {} }), "Temporary system problem. Please retry later.");
  assert.equal(renderLoginState({ status: 401, body: {} }), "Invalid email or password.");
  assert.equal(renderLoginState({ status: 418, body: {} }), "Login failed.");
});

test("submitManuscriptUpload covers no-file, default payload, and explicit extra payload", () => {
  const noFile = submitManuscriptUpload(() => ({}), "s1", null, { email: "a@example.com" });
  assert.equal(noFile.status, 400);
  assert.equal(noFile.body.code, "NO_FILE_SELECTED");

  let captured = null;
  const apiClient = (route, request) => {
    captured = { route, request };
    return { status: 202, body: { status: "ATTACHED" } };
  };

  const file = { fileName: "paper.pdf", mimeType: "application/pdf", byteSize: 1000 };
  const defaulted = submitManuscriptUpload(apiClient, "s2", file, { email: "u@example.com" });
  assert.equal(defaulted.status, 202);
  assert.equal(captured.route, "/api/v1/submissions/:submissionId/manuscript:POST");
  assert.equal(captured.request.body.file_fingerprint, "paper.pdf");
  assert.equal(captured.request.body.mode, "RESTART");
  assert.equal(captured.request.body.resume_offset_bytes, 0);

  submitManuscriptUpload(apiClient, "s2", file, { email: "u@example.com" }, {
    file_fingerprint: "fp-1",
    mode: "RESUME",
    resume_offset_bytes: 2048
  });
  assert.equal(captured.request.body.file_fingerprint, "fp-1");
  assert.equal(captured.request.body.mode, "RESUME");
  assert.equal(captured.request.body.resume_offset_bytes, 2048);
});
