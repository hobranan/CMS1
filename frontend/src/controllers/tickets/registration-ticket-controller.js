export function buildRegistrationTicketViewModel(ticket) {
  return {
    ticketReference: ticket.ticketReference,
    qrCodePresent: Boolean(ticket.qrCodePresent),
    format: ticket.format ?? "pdf"
  };
}

