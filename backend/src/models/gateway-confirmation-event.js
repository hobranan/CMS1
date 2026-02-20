import crypto from "node:crypto";

const VALID_GATEWAY_STATUSES = new Set(["success", "declined", "canceled", "invalid", "timeout"]);

export function asGatewayConfirmationEvent(payload) {
  if (!VALID_GATEWAY_STATUSES.has(payload.gatewayStatus)) {
    throw new Error("INVALID_GATEWAY_STATUS");
  }
  return {
    eventId: payload.eventId ?? crypto.randomUUID(),
    attemptId: String(payload.attemptId),
    gatewayStatus: payload.gatewayStatus,
    receivedAt: payload.receivedAt ?? new Date().toISOString(),
    payloadSignatureValid: Boolean(payload.payloadSignatureValid)
  };
}

