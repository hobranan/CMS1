export function mapTicketFailure(errorCode) {
  if (errorCode === "TICKET_GENERATION_FAILED") {
    return { status: 500, code: "TICKET_GENERATION_FAILED", message: "Ticket generation failed. Please retry." };
  }
  if (errorCode === "TICKET_STORAGE_FAILED") {
    return {
      status: 500,
      code: "TICKET_STORAGE_FAILED",
      message: "Ticket storage failed. Retrieval may be unavailable until resolved."
    };
  }
  return { status: 500, code: "TICKET_ISSUANCE_FAILED", message: "Ticket issuance failed." };
}

