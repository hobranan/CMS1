export function asTicketRetrievalAccess(payload) {
  return {
    registrationId: String(payload.registrationId),
    attendeeId: String(payload.attendeeId),
    retrievalAvailable: Boolean(payload.retrievalAvailable)
  };
}

