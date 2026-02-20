export function buildTicketOutcomeFeedback(code) {
  if (code === "PAYMENT_PENDING_OR_UNRESOLVED") {
    return "Payment is still pending. Ticket will be issued after confirmation.";
  }
  if (code === "TICKET_STORAGE_FAILED") {
    return "Ticket was generated but storage failed. Please retry or contact support.";
  }
  return "Ticket issuance failed. Please retry.";
}

