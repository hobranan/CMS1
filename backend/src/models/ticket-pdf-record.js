export function asTicketPdfRecord(payload) {
  return {
    ticketId: String(payload.ticketId),
    registrationId: String(payload.registrationId),
    contentType: "application/pdf",
    pdfContent: String(payload.pdfContent),
    retrievalAvailable: payload.retrievalAvailable ?? true,
    storedAt: payload.storedAt ?? new Date().toISOString()
  };
}

