import crypto from "node:crypto";

const VALID_ATTEMPT_STATUSES = new Set([
  "initiated",
  "canceled",
  "invalid_details",
  "declined",
  "pending_confirmation",
  "confirmed",
  "failed"
]);

export function asRegistrationPaymentAttempt(payload) {
  const status = payload.status ?? "initiated";
  if (!VALID_ATTEMPT_STATUSES.has(status)) {
    throw new Error("INVALID_PAYMENT_ATTEMPT_STATUS");
  }
  return {
    attemptId: payload.attemptId ?? crypto.randomUUID(),
    attendeeId: String(payload.attendeeId),
    registrationId: String(payload.registrationId),
    categoryId: String(payload.categoryId),
    amount: Number(payload.amount),
    currency: String(payload.currency ?? "CAD"),
    status,
    gatewayReference: payload.gatewayReference ?? null,
    createdAt: payload.createdAt ?? new Date().toISOString()
  };
}

