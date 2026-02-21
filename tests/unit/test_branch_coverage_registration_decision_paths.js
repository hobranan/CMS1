import test from "node:test";
import assert from "node:assert/strict";

import { asRegistrationStatus, canTransitionRegistrationState } from "../../backend/src/models/registration-status.js";
import { verifyRegistration } from "../../backend/src/services/registration/verification_service.js";
import { RegistrationRepository } from "../../backend/src/models/registration_repository.js";
import { generateRawToken, hashToken } from "../../backend/src/services/security/verification_token_service.js";
import { createGetDecisionContextController } from "../../backend/src/api/decisions/get-decision-context-controller.js";
import { createGetPendingInvitationsController } from "../../backend/src/api/invitations/get-pending-invitations-controller.js";
import { createGetEditableScheduleController } from "../../backend/src/api/schedule-edit/get-editable-schedule-controller.js";

test("registration status model covers defaults, invalid state, and transition matrix", () => {
  const status = asRegistrationStatus({ registrationId: "r1" });
  assert.equal(status.state, "unpaid");
  assert.equal(status.paymentId, null);
  assert.throws(() => asRegistrationStatus({ registrationId: "r1", state: "bad" }), /INVALID_REGISTRATION_STATE/);

  assert.equal(canTransitionRegistrationState("unpaid", "pending"), true);
  assert.equal(canTransitionRegistrationState("unpaid", "paid_confirmed"), true);
  assert.equal(canTransitionRegistrationState("pending", "pending"), true);
  assert.equal(canTransitionRegistrationState("pending", "paid_confirmed"), true);
  assert.equal(canTransitionRegistrationState("paid_confirmed", "pending"), false);
  assert.equal(canTransitionRegistrationState("paid_confirmed", "unpaid"), false);
});

test("verifyRegistration covers all token/pending branches and success idempotency", () => {
  const now = new Date("2026-02-21T12:00:00.000Z");
  const buildDeps = () => ({
    repository: new RegistrationRepository(),
    nowProvider: () => now,
    auditLog: { record() {} }
  });

  {
    const deps = buildDeps();
    assert.equal(verifyRegistration(deps, { query: {} }).status, 400);
  }

  {
    const deps = buildDeps();
    assert.equal(verifyRegistration(deps, { query: { token: "abc" } }).status, 410);
  }

  {
    const deps = buildDeps();
    const pending = deps.repository.createPendingRegistration({
      email: "u@example.com",
      passwordHash: "hash",
      now,
      expiresAt: new Date("2026-02-28T12:00:00.000Z")
    });
    const token = generateRawToken();
    const tokenHash = deps.repository.saveVerificationToken({
      pendingRegistrationId: pending.id,
      tokenHash: "unused",
      issuedAt: now,
      expiresAt: new Date("2026-02-22T12:00:00.000Z")
    }).tokenHash;
    deps.repository.markTokenUsed(tokenHash, now);
    assert.equal(verifyRegistration(deps, { query: { token } }).status, 410);
  }

  {
    const deps = buildDeps();
    const pending = deps.repository.createPendingRegistration({
      email: "u2@example.com",
      passwordHash: "hash",
      now,
      expiresAt: new Date("2026-02-28T12:00:00.000Z")
    });
    const token = generateRawToken();
    const tokenHash = deps.repository.saveVerificationToken({
      pendingRegistrationId: pending.id,
      tokenHash: hashToken(token),
      issuedAt: new Date("2026-02-01T12:00:00.000Z"),
      expiresAt: new Date("2026-02-02T12:00:00.000Z")
    }).tokenHash;
    assert.equal(tokenHash.length > 0, true);
    assert.equal(verifyRegistration(deps, { query: { token } }).status, 410);
  }

  {
    const deps = buildDeps();
    const token = generateRawToken();
    deps.repository.saveVerificationToken({
      pendingRegistrationId: "missing-pending",
      tokenHash: hashToken(token),
      issuedAt: now,
      expiresAt: new Date("2026-02-22T12:00:00.000Z")
    });
    assert.equal(verifyRegistration(deps, { query: { token } }).status, 410);
  }

  {
    const deps = buildDeps();
    const pending = deps.repository.createPendingRegistration({
      email: "expired@example.com",
      passwordHash: "hash",
      now: new Date("2026-02-01T12:00:00.000Z"),
      expiresAt: new Date("2026-02-02T12:00:00.000Z")
    });
    const token = generateRawToken();
    deps.repository.saveVerificationToken({
      pendingRegistrationId: pending.id,
      tokenHash: hashToken(token),
      issuedAt: now,
      expiresAt: new Date("2026-02-22T12:00:00.000Z")
    });
    assert.equal(verifyRegistration(deps, { query: { token } }).status, 410);
    assert.equal(deps.repository.findPendingByEmail("expired@example.com").status, "EXPIRED");
  }

  {
    const deps = buildDeps();
    const pending = deps.repository.createPendingRegistration({
      email: "ok@example.com",
      passwordHash: "hash",
      now,
      expiresAt: new Date("2026-02-28T12:00:00.000Z")
    });
    const token = generateRawToken();
    deps.repository.saveVerificationToken({
      pendingRegistrationId: pending.id,
      tokenHash: hashToken(token),
      issuedAt: now,
      expiresAt: new Date("2026-02-22T12:00:00.000Z")
    });
    const first = verifyRegistration(deps, { query: { token } });
    assert.equal(first.status, 200);
    assert.equal(deps.repository.findActiveUserByEmail("ok@example.com").status, "ACTIVE");

    const second = verifyRegistration(deps, { query: { token } });
    assert.equal(second.status, 410);
  }
});

test("decision context, pending invitations, and editable schedule controllers cover guard and success branches", () => {
  {
    const controller = createGetDecisionContextController({
      paperDecisionRepository: {
        getPaper() {
          return null;
        },
        getDecision() {
          return null;
        }
      }
    });
    assert.equal(controller.get({ user: null, params: { paperId: "p1" } }).status, 401);
    assert.equal(
      controller.get({ user: { email: "e@x.com", role: "editor", id: "ed1" }, params: { paperId: "p1" } }).status,
      404
    );
  }

  {
    const controller = createGetDecisionContextController({
      paperDecisionRepository: {
        getPaper() {
          return { paperId: "p1", editorId: "ed2", status: "UNDER_REVIEW", completedReviewCount: 2, decisionPeriodOpen: true };
        },
        getDecision() {
          return null;
        }
      }
    });
    assert.equal(
      controller.get({ user: { email: "e@x.com", role: "editor", id: "ed1" }, params: { paperId: "p1" } }).status,
      403
    );
  }

  {
    const controller = createGetDecisionContextController({
      paperDecisionRepository: {
        getPaper() {
          return { paperId: "p1", editorId: "ed1", status: "UNDER_REVIEW", completedReviewCount: 2, decisionPeriodOpen: true };
        },
        getDecision() {
          return null;
        }
      }
    });
    assert.equal(
      controller.get({ user: { email: "e@x.com", role: "editor", id: "ed1" }, params: { paperId: "p1" } }).status,
      200
    );
  }

  {
    const controller = createGetPendingInvitationsController({
      reviewInvitationRepository: {
        listByReferee() {
          return [];
        }
      }
    });
    assert.equal(controller.get({ user: null, params: { refereeId: "r1" } }).status, 401);
    assert.equal(controller.get({ user: { email: "r@x.com", role: "referee", id: "r2" }, params: { refereeId: "r1" } }).status, 401);
    assert.equal(controller.get({ user: { email: "r@x.com", role: "referee", id: "r1" }, params: { refereeId: "r1" } }).status, 200);
  }

  {
    const controller = createGetEditableScheduleController({
      scheduleDraftRepository: {
        getPublished() {
          return null;
        }
      },
      scheduleEditVersions: new Map()
    });
    assert.equal(controller.get({ user: null, params: { conferenceId: "c1" } }).status, 401);
    assert.equal(controller.get({ user: { email: "a@x.com", role: "author" }, params: { conferenceId: "c1" } }).status, 403);
    assert.equal(controller.get({ user: { email: "e@x.com", role: "editor" }, params: { conferenceId: "c1" } }).status, 404);
  }

  {
    const schedule = { conferenceId: "c1", status: "published", grid: [], placements: [], conflicts: [] };
    const versions = new Map([["c1", 7]]);
    const controller = createGetEditableScheduleController({
      scheduleDraftRepository: {
        getPublished() {
          return schedule;
        }
      },
      scheduleEditVersions: versions
    });
    const res = controller.get({ user: { email: "e@x.com", role: "editor" }, params: { conferenceId: "c1" } });
    assert.equal(res.status, 200);
    assert.equal(res.body.version, 7);
  }
});
