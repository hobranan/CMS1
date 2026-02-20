import { mapTicketError } from "./ticket-error-mapper.js";
import { canIssueTicket } from "../../services/tickets/ticket-issuance-eligibility-service.js";
import { createTicketReference } from "../../services/tickets/ticket-reference-service.js";
import { createTicketQrPayload } from "../../services/tickets/ticket-qr-service.js";
import { generateTicketPdf } from "../../services/tickets/ticket-pdf-generation-service.js";
import { saveTicketPdf } from "../../services/tickets/ticket-pdf-storage-service.js";
import { mapTicketFailure } from "../../services/tickets/ticket-failure-handling-service.js";
import { mapTicketDeliveryOutcome } from "./ticket-delivery-outcome-mapper.js";

export function createPostIssueTicketController(deps) {
  return {
    post(request = {}) {
      const userId = request.user?.id;
      if (!userId) {
        return mapTicketError(401, "AUTHENTICATION_REQUIRED", "Authentication is required.");
      }
      const registrationId = request.params?.registrationId;
      const eligibility = canIssueTicket(deps.paymentWorkflowStore, deps.ticketStore, registrationId, userId);
      if (!eligibility.ok) {
        return mapTicketError(eligibility.status, eligibility.code, eligibility.message);
      }

      if (eligibility.existingTicket) {
        return {
          status: 200,
          body: {
            ticketId: eligibility.existingTicket.ticketId,
            ticketReference: eligibility.existingTicket.ticketReference,
            registrationState: "paid_confirmed",
            qrCodePresent: true,
            format: "pdf",
            deliveryStatus: eligibility.existingTicket.deliveryStatus
          }
        };
      }

      if (deps.ticketStore.failNextGeneration) {
        deps.ticketStore.failNextGeneration = false;
        const mapped = mapTicketFailure("TICKET_GENERATION_FAILED");
        return mapTicketError(mapped.status, mapped.code, mapped.message);
      }

      try {
        const ticketReference = createTicketReference();
        const qrCode = createTicketQrPayload({ registrationId, ticketReference });
        const ticket = deps.ticketStore.saveTicket({
          registrationId,
          ticketReference,
          qrCode
        });
        const pdfContent = generateTicketPdf(ticket);
        saveTicketPdf(deps.ticketStore, {
          ticketId: ticket.ticketId,
          registrationId,
          pdfContent
        });
        const delivery = mapTicketDeliveryOutcome(deps.ticketStore.forceDeliveryFailure);
        ticket.deliveryStatus = delivery.status;
        deps.ticketObservabilityService?.record("ticket_issued");
        return {
          status: 200,
          body: {
            ticketId: ticket.ticketId,
            ticketReference: ticket.ticketReference,
            registrationState: "paid_confirmed",
            qrCodePresent: true,
            format: "pdf",
            deliveryStatus: delivery.status,
            deliveryMessage: delivery.message
          }
        };
      } catch (error) {
        const mapped = mapTicketFailure(error.code);
        deps.ticketObservabilityService?.record("ticket_issue_failure");
        return mapTicketError(mapped.status, mapped.code, mapped.message);
      }
    }
  };
}

