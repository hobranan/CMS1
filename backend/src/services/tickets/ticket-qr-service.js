export function createTicketQrPayload({ registrationId, ticketReference }) {
  return `qr:registration=${registrationId};reference=${ticketReference}`;
}

