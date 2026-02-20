import { createPostIssueTicketController } from "./post-issue-ticket-controller.js";
import { createGetTicketMetadataController } from "./get-ticket-metadata-controller.js";
import { createGetTicketPdfController } from "./get-ticket-pdf-controller.js";

export function createTicketRoutes(deps) {
  const issueController = createPostIssueTicketController(deps);
  const metadataController = createGetTicketMetadataController(deps);
  const pdfController = createGetTicketPdfController(deps);

  return {
    "/api/v1/registrations/:registrationId/ticket/issue:POST": issueController.post,
    "/api/v1/account/registrations/:registrationId/ticket:GET": metadataController.get,
    "/api/v1/account/registrations/:registrationId/ticket.pdf:GET": pdfController.get
  };
}

