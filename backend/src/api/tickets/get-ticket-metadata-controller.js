import { mapTicketError } from "./ticket-error-mapper.js";

export function createGetTicketMetadataController(deps) {
  return {
    get(request = {}) {
      const userId = request.user?.id;
      if (!userId) {
        return mapTicketError(401, "AUTHENTICATION_REQUIRED", "Authentication is required.");
      }
      const registrationId = request.params?.registrationId;
      const registration = deps.paymentWorkflowStore.getRegistration(registrationId);
      if (!registration || registration.attendeeId !== userId) {
        return mapTicketError(404, "TICKET_NOT_FOUND", "Ticket not found.");
      }
      const ticket = deps.ticketStore.getTicketByRegistrationId(registrationId);
      if (!ticket) {
        return mapTicketError(404, "TICKET_NOT_FOUND", "Ticket not found.");
      }
      const pdf = deps.ticketStore.getPdfByRegistrationId(registrationId);
      return {
        status: 200,
        body: {
          ticketId: ticket.ticketId,
          ticketReference: ticket.ticketReference,
          issuedAt: ticket.issuedAt,
          qrCodePresent: true,
          format: "pdf",
          retrievalAvailable: Boolean(pdf?.retrievalAvailable)
        }
      };
    }
  };
}

