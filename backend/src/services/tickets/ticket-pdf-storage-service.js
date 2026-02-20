export function saveTicketPdf(ticketStore, { ticketId, registrationId, pdfContent }) {
  return ticketStore.savePdf({
    ticketId,
    registrationId,
    pdfContent,
    retrievalAvailable: true
  });
}

export function getTicketPdf(ticketStore, registrationId) {
  if (ticketStore.failPdfRead) {
    ticketStore.failPdfRead = false;
    const err = new Error("TICKET_STORAGE_UNAVAILABLE");
    err.code = "TICKET_STORAGE_UNAVAILABLE";
    throw err;
  }
  return ticketStore.getPdfByRegistrationId(registrationId);
}

