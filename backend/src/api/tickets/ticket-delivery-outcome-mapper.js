export function mapTicketDeliveryOutcome(forceFailure = false) {
  if (forceFailure) {
    return { status: "failed", message: "Ticket notification delivery failed. Ticket remains available in your account." };
  }
  return { status: "sent", message: null };
}

