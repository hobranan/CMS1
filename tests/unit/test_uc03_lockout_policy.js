import test from "node:test";
import assert from "node:assert/strict";
import { LockoutStateRepository } from "../../backend/src/models/lockout_state_repository.js";
import { isLocked, registerFailure, resetFailures } from "../../backend/src/services/auth/lockout_policy_service.js";

test("lockout activates at threshold and resets on success", () => {
  const repo = new LockoutStateRepository();
  const now = new Date("2026-02-20T00:00:00.000Z");
  for (let i = 0; i < 4; i += 1) {
    const state = registerFailure(repo, "x@example.com", now);
    assert.equal(state.locked, false);
  }
  const threshold = registerFailure(repo, "x@example.com", now);
  assert.equal(threshold.locked, true);
  resetFailures(repo, "x@example.com");
  assert.equal(repo.getState("x@example.com").failedAttemptCount, 0);
});

test("expired lockout no longer blocks login", () => {
  const repo = new LockoutStateRepository();
  const now = new Date("2026-02-20T00:00:00.000Z");
  for (let i = 0; i < 5; i += 1) {
    registerFailure(repo, "x@example.com", now);
  }
  const after = new Date("2026-02-20T00:16:00.000Z");
  const state = isLocked(repo, "x@example.com", after);
  assert.equal(state.locked, false);
});
