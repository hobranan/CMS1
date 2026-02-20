import crypto from "node:crypto";

export function asRegistrationTicket(payload) {
  return {
    ticketId: payload.ticketId ?? crypto.randomUUID(),
    registrationId: String(payload.registrationId),
    ticketReference: String(payload.ticketReference),
    qrCode: String(payload.qrCode),
    format: "pdf",
    issuedAt: payload.issuedAt ?? new Date().toISOString(),
    deliveryStatus: payload.deliveryStatus ?? "not_attempted"
  };
}

