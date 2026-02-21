import test from "node:test";
import assert from "node:assert/strict";

import { PaperRefereeAssignmentRepository } from "../../backend/src/models/paper-referee-assignment.js";
import { PaymentWorkflowStore } from "../../backend/src/models/payment-workflow-store.js";
import { RegistrationRepository } from "../../backend/src/models/registration_repository.js";
import { createRegistration } from "../../backend/src/services/registration/registration_service.js";
import { createPostGatewayConfirmController } from "../../backend/src/api/payments/post-gateway-confirm-controller.js";

test("PaperRefereeAssignmentRepository applies and restores assignments across referee/paper states", () => {
  const repo = new PaperRefereeAssignmentRepository();
  const now = new Date("2026-02-21T00:00:00.000Z");

  repo.seedPaper({ paperId: "p1", status: "SUBMITTED", version: 0 });
  repo.seedReferee({ refereeId: "r1", currentLoad: 1 });
  repo.seedReferee({ refereeId: "r2", currentLoad: 0 });
  // r-missing is intentionally not seeded to hit branch where ref is absent.

  const previous = repo.applyAssignment({ paperId: "p1", refereeIds: ["r2", "r-missing"], now });
  assert.deepEqual(previous.refereeIds, []);
  assert.equal(repo.getReferee("r1").currentLoad, 1);
  assert.equal(repo.getReferee("r2").currentLoad, 1);
  assert.equal(repo.getPaper("p1").status, "ASSIGNED");
  assert.equal(repo.getPaper("p1").version, 1);

  repo.restoreAssignment({
    paperId: "p1",
    previousAssignment: {
      paperId: "p1",
      refereeIds: ["r1"],
      assignedAt: "2026-02-20T00:00:00.000Z"
    },
    now
  });
  assert.equal(repo.getReferee("r1").currentLoad, 2);
  assert.equal(repo.getReferee("r2").currentLoad, 0);
  assert.equal(repo.getAssignment("p1").assignedAt, "2026-02-20T00:00:00.000Z");
  assert.equal(repo.getPaper("p1").status, "ASSIGNED");

  // Cover paper-null branch and status fallback to SUBMITTED.
  repo.restoreAssignment({
    paperId: "p-missing",
    previousAssignment: { paperId: "p-missing", refereeIds: [] },
    now
  });
  assert.deepEqual(repo.getAssignment("p-missing").refereeIds, []);
});

test("PaperRefereeAssignmentRepository covers reassignment replacement and submitted fallback", () => {
  const repo = new PaperRefereeAssignmentRepository();
  const now = new Date("2026-02-21T00:00:00.000Z");

  repo.seedPaper({ paperId: "p2", status: "ASSIGNED", version: 4 });
  repo.seedReferee({ refereeId: "ra", currentLoad: 0 });
  repo.seedReferee({ refereeId: "rb", currentLoad: 1 });

  repo.applyAssignment({ paperId: "p2", refereeIds: ["rb"], now });
  repo.applyAssignment({ paperId: "p2", refereeIds: ["ra"], now });
  assert.equal(repo.getReferee("rb").currentLoad, 1);
  assert.equal(repo.getReferee("ra").currentLoad, 1);

  repo.restoreAssignment({ paperId: "p2", previousAssignment: {}, now });
  assert.equal(repo.getPaper("p2").status, "SUBMITTED");
});

test("PaymentWorkflowStore covers null updates, failNextPersist, and reconciliation", () => {
  const store = new PaymentWorkflowStore();

  const seeded = store.seedRegistration({
    registrationId: "reg-1",
    attendeeId: "att-1",
    categoryId: "regular",
    amount: 300
  });
  assert.equal(seeded.state, "unpaid");
  assert.equal(store.getRegistration("missing"), null);
  assert.equal(store.updateRegistration("missing", { state: "pending" }), null);

  const attempt = store.createAttempt({
    attendeeId: "att-1",
    registrationId: "reg-1",
    categoryId: "regular",
    amount: 300
  });
  assert.equal(store.getAttempt(attempt.attemptId).status, "initiated");
  assert.equal(store.updateAttempt("missing", { status: "confirmed" }), null);
  assert.equal(store.updateAttempt(attempt.attemptId, { status: "pending_confirmation" }).status, "pending_confirmation");

  store.failNextPersist();
  assert.throws(
    () =>
      store.createPaymentRecord({
        attemptId: attempt.attemptId,
        registrationId: "reg-1",
        gatewayReference: "gw-1",
        amount: 300
      }),
    /PAYMENT_RECORD_PERSISTENCE_FAILED/
  );

  const record = store.createPaymentRecord({
    attemptId: attempt.attemptId,
    registrationId: "reg-1",
    gatewayReference: "gw-2",
    amount: 300
  });
  assert.ok(record.paymentId);

  const reconciliation = store.createReconciliationItem({
    attemptId: attempt.attemptId,
    reason: "gateway_success_persist_failed"
  });
  assert.equal(reconciliation.reason, "gateway_success_persist_failed");
});

test("RegistrationRepository covers lock, pending/user/token lifecycle branches", () => {
  const repo = new RegistrationRepository();
  const now = new Date("2026-02-21T00:00:00.000Z");

  assert.equal(RegistrationRepository.normalizeEmail("  USER@EXAMPLE.COM "), "user@example.com");
  assert.equal(repo.acquireLock("user@example.com"), true);
  assert.equal(repo.acquireLock("user@example.com"), false);
  repo.releaseLock("user@example.com");

  const pending = repo.createPendingRegistration({
    email: "user@example.com",
    passwordHash: "hash",
    now,
    expiresAt: new Date("2026-02-28T00:00:00.000Z")
  });
  assert.equal(repo.findPendingByEmail("USER@example.com").id, pending.id);

  assert.equal(repo.markPendingVerified("none@example.com", now), null);
  assert.equal(repo.markPendingExpired("none@example.com"), null);
  assert.equal(repo.markPendingVerified("user@example.com", now).status, "VERIFIED");
  assert.equal(repo.markPendingExpired("user@example.com").status, "EXPIRED");

  const active = repo.createActiveUser({ email: "user@example.com", passwordHash: "hash2", now });
  assert.equal(repo.findActiveUserByEmail("USER@example.com").id, active.id);

  const token1 = repo.saveVerificationToken({
    pendingRegistrationId: pending.id,
    tokenHash: "token-hash-1",
    issuedAt: now,
    expiresAt: new Date("2026-02-22T00:00:00.000Z")
  });
  repo.saveVerificationToken({
    pendingRegistrationId: pending.id,
    tokenHash: "token-hash-2",
    issuedAt: now,
    expiresAt: new Date("2026-02-22T00:00:00.000Z")
  });
  assert.equal(repo.getTokenByHash("missing"), null);
  assert.equal(repo.markTokenUsed("missing", now), null);
  repo.markTokenUsed("token-hash-1", now);
  repo.invalidateActiveTokens(pending.id, now);
  assert.ok(repo.getTokenByHash("token-hash-2").invalidatedAt);
  assert.equal(repo.getTokenByHash("token-hash-1").id, token1.id);
});

test("createRegistration covers validation, lock, race, and success paths", () => {
  const now = new Date("2026-02-21T00:00:00.000Z");
  const goodBody = {
    email: "new@example.com",
    password: "StrongPass123!",
    confirmPassword: "StrongPass123!"
  };

  {
    const deps = { repository: new RegistrationRepository(), nowProvider: () => now };
    const result = createRegistration(deps, { body: { email: "", password: "", confirmPassword: "" } });
    assert.equal(result.status, 422);
    assert.ok(Array.isArray(result.body.errors));
  }

  {
    const repo = new RegistrationRepository();
    repo.acquireLock("new@example.com");
    const result = createRegistration(
      {
        repository: repo,
        nowProvider: () => now,
        verificationEmailService: { sendVerificationEmail() {} }
      },
      { body: goodBody }
    );
    assert.equal(result.status, 409);
    repo.releaseLock("new@example.com");
  }

  {
    let firstCheck = true;
    const repo = {
      pending: null,
      acquireLock() {
        return true;
      },
      releaseLock() {},
      findActiveUserByEmail() {
        if (firstCheck) {
          firstCheck = false;
          return null;
        }
        return { id: "existing" };
      },
      findPendingByEmail() {
        return null;
      }
    };
    const result = createRegistration(
      {
        repository: repo,
        nowProvider: () => now,
        verificationEmailService: { sendVerificationEmail() {} }
      },
      { body: goodBody }
    );
    assert.equal(result.status, 409);
  }

  {
    const repo = new RegistrationRepository();
    const sent = [];
    const audits = [];
    const result = createRegistration(
      {
        repository: repo,
        nowProvider: () => now,
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
      { body: goodBody }
    );
    assert.equal(result.status, 202);
    assert.equal(result.body.status, "PENDING_VERIFICATION");
    assert.equal(sent.length, 1);
    assert.equal(audits.length, 1);
    assert.equal(repo.findPendingByEmail("new@example.com").status, "PENDING_VERIFICATION");
  }
});

test("post-gateway-confirm controller covers payload/auth/status/signature/registration and outcomes", () => {
  const mkStore = () => {
    const attempts = new Map();
    const registrations = new Map();
    return {
      attempts,
      registrations,
      reconciliationItems: new Map(),
      paymentRecords: new Map(),
      getAttempt(id) {
        return attempts.get(id) ?? null;
      },
      updateAttempt(id, patch) {
        const current = attempts.get(id);
        if (!current) return null;
        Object.assign(current, patch);
        return current;
      },
      getRegistration(id) {
        return registrations.get(id) ?? null;
      },
      updateRegistration(id, patch) {
        const current = registrations.get(id);
        if (!current) return null;
        Object.assign(current, patch);
        return current;
      },
      createPaymentRecord(payload) {
        const record = { paymentId: "pay-1", ...payload };
        this.paymentRecords.set(record.paymentId, record);
        return record;
      },
      createReconciliationItem(payload) {
        const item = { reconciliationId: "rec-1", status: "open", ...payload };
        this.reconciliationItems.set(item.reconciliationId, item);
        return item;
      }
    };
  };

  const createHarness = (registrationState = "unpaid") => {
    const store = mkStore();
    store.attempts.set("att-1", {
      attemptId: "att-1",
      registrationId: "reg-1",
      attendeeId: "u1",
      amount: 100,
      currency: "CAD",
      categoryId: "regular",
      status: "initiated"
    });
    store.registrations.set("reg-1", { registrationId: "reg-1", state: registrationState });
    const controller = createPostGatewayConfirmController({
      paymentWorkflowStore: store,
      paymentObservabilityService: { record() {} }
    });
    return { store, controller };
  };

  const { store, controller } = createHarness("unpaid");

  assert.equal(controller.post({ body: {} }).status, 400);
  assert.equal(
    controller.post({
      body: { attemptId: "unknown", gatewayStatus: "success", gatewayReference: "gw", signature: "valid-signature" }
    }).status,
    400
  );
  assert.equal(
    controller.post({
      body: { attemptId: "att-1", gatewayStatus: "bad", gatewayReference: "gw", signature: "valid-signature" }
    }).status,
    400
  );
  assert.equal(
    controller.post({
      body: { attemptId: "att-1", gatewayStatus: "success", gatewayReference: "gw", signature: "invalid-signature" }
    }).status,
    400
  );

  const noRegStore = mkStore();
  noRegStore.attempts.set("att-2", { attemptId: "att-2", registrationId: "reg-x", amount: 100, currency: "CAD", categoryId: "regular" });
  const noRegController = createPostGatewayConfirmController({
    paymentWorkflowStore: noRegStore,
    paymentObservabilityService: { record() {} }
  });
  assert.equal(
    noRegController.post({
      body: { attemptId: "att-2", gatewayStatus: "success", gatewayReference: "gw", signature: "valid-signature" }
    }).status,
    404
  );

  // Duplicate paid.
  {
    const { controller: duplicateController } = createHarness("paid_confirmed");
    assert.equal(
      duplicateController.post({
        body: { attemptId: "att-1", gatewayStatus: "success", gatewayReference: "gw", signature: "valid-signature" }
      }).status,
      409
    );
  }

  // Success confirmation.
  {
    const { controller: successController } = createHarness("unpaid");
    const confirmed = successController.post({
      body: { attemptId: "att-1", gatewayStatus: "success", gatewayReference: "gw", signature: "valid-signature" }
    });
    assert.equal(confirmed.status, 200);
    assert.equal(confirmed.body.outcome, "confirmed");
    assert.equal(confirmed.body.reconciliationId, null);
  }

  // Timeout flow.
  {
    const { controller: timeoutController } = createHarness("unpaid");
    const timeout = timeoutController.post({
      body: { attemptId: "att-1", gatewayStatus: "timeout", gatewayReference: "gw-timeout", signature: "valid-signature" }
    });
    assert.equal(timeout.status, 200);
    assert.equal(timeout.body.outcome, "pending_unresolved");
    assert.ok(timeout.body.reconciliationId);
  }

  // Non-success (declined/canceled/invalid) path.
  {
    const { controller: declinedController } = createHarness("unpaid");
    const declined = declinedController.post({
      body: { attemptId: "att-1", gatewayStatus: "declined", gatewayReference: "gw-declined", signature: "valid-signature" }
    });
    assert.equal(declined.status, 200);
    assert.equal(declined.body.outcome, "declined");
  }
});
