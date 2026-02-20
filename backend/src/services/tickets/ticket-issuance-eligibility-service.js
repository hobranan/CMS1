import { isPaymentConfirmedAndRecorded } from "../../models/payment-confirmation-state.js";

export function canIssueTicket(paymentStore, ticketStore, registrationId, attendeeId) {
  const registration = paymentStore.getRegistration(registrationId);
  if (!registration || registration.attendeeId !== attendeeId) {
    return { ok: false, status: 404, code: "REGISTRATION_NOT_FOUND", message: "Registration not found." };
  }
  if (!isPaymentConfirmedAndRecorded(registration)) {
    return {
      ok: false,
      status: 409,
      code: "PAYMENT_PENDING_OR_UNRESOLVED",
      message: "Ticket can be issued only after payment is confirmed."
    };
  }
  const existingTicket = ticketStore.getTicketByRegistrationId(registrationId);
  if (existingTicket) {
    return { ok: true, registration, existingTicket };
  }
  return { ok: true, registration, existingTicket: null };
}

