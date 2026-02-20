import { mapTicketError } from "./ticket-error-mapper.js";
import { getTicketPdf } from "../../services/tickets/ticket-pdf-storage-service.js";

export function createGetTicketPdfController(deps) {
  return {
    get(request = {}) {
      const userId = request.user?.id;
      if (!userId) {
        return mapTicketError(401, "AUTHENTICATION_REQUIRED", "Authentication is required.");
      }
      const registrationId = request.params?.registrationId;
      const registration = deps.paymentWorkflowStore.getRegistration(registrationId);
      if (!registration || registration.attendeeId !== userId) {
        return mapTicketError(404, "TICKET_NOT_FOUND", "Ticket PDF not found.");
      }
      try {
        const pdf = getTicketPdf(deps.ticketStore, registrationId);
        if (!pdf) {
          return mapTicketError(404, "TICKET_NOT_FOUND", "Ticket PDF not found.");
        }
        return {
          status: 200,
          body: pdf.pdfContent,
          headers: {
            "content-type": "application/pdf",
            "content-disposition": `inline; filename=\"ticket-${registrationId}.pdf\"`
          }
        };
      } catch (error) {
        if (error.code === "TICKET_STORAGE_UNAVAILABLE") {
          return mapTicketError(
            503,
            "TICKET_STORAGE_UNAVAILABLE",
            "Ticket storage is temporarily unavailable. Please retry."
          );
        }
        return mapTicketError(500, "TICKET_RETRIEVAL_FAILED", "Ticket retrieval failed.");
      }
    }
  };
}

