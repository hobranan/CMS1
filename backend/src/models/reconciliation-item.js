import crypto from "node:crypto";

const VALID_REASONS = new Set([
  "gateway_success_persist_failed",
  "confirmation_timeout",
  "duplicate_attempt_after_success"
]);

export function asReconciliationItem(payload) {
  if (!VALID_REASONS.has(payload.reason)) {
    throw new Error("INVALID_RECONCILIATION_REASON");
  }
  return {
    reconciliationId: payload.reconciliationId ?? crypto.randomUUID(),
    attemptId: String(payload.attemptId),
    reason: payload.reason,
    status: payload.status ?? "open",
    createdAt: payload.createdAt ?? new Date().toISOString()
  };
}

