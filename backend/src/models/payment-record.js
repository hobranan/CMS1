import crypto from "node:crypto";

export function asPaymentRecord(payload) {
  return {
    paymentId: payload.paymentId ?? crypto.randomUUID(),
    attemptId: String(payload.attemptId),
    registrationId: String(payload.registrationId),
    gatewayReference: String(payload.gatewayReference),
    amount: Number(payload.amount),
    currency: String(payload.currency ?? "CAD"),
    recordedAt: payload.recordedAt ?? new Date().toISOString()
  };
}

