export function generateTicketPdf(ticket) {
  return [
    "PDF-TICKET",
    `TICKET:${ticket.ticketId}`,
    `REFERENCE:${ticket.ticketReference}`,
    `QR:${ticket.qrCode}`,
    `ISSUED_AT:${ticket.issuedAt}`
  ].join("\n");
}

