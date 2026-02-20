import { asRegistrationTicket } from "./registration-ticket.js";
import { asTicketPdfRecord } from "./ticket-pdf-record.js";

export class TicketStore {
  constructor() {
    this.ticketByRegistrationId = new Map();
    this.pdfByRegistrationId = new Map();
    this.failNextGeneration = false;
    this.failNextStorage = false;
    this.forceDeliveryFailure = false;
    this.failPdfRead = false;
  }

  getTicketByRegistrationId(registrationId) {
    return this.ticketByRegistrationId.get(registrationId) ?? null;
  }

  getPdfByRegistrationId(registrationId) {
    return this.pdfByRegistrationId.get(registrationId) ?? null;
  }

  saveTicket(payload) {
    const ticket = asRegistrationTicket(payload);
    this.ticketByRegistrationId.set(ticket.registrationId, ticket);
    return ticket;
  }

  savePdf(payload) {
    if (this.failNextStorage) {
      this.failNextStorage = false;
      const err = new Error("TICKET_STORAGE_FAILED");
      err.code = "TICKET_STORAGE_FAILED";
      throw err;
    }
    const record = asTicketPdfRecord(payload);
    this.pdfByRegistrationId.set(record.registrationId, record);
    return record;
  }

  failNextTicketGeneration() {
    this.failNextGeneration = true;
  }

  failNextTicketStorage() {
    this.failNextStorage = true;
  }

  failNextPdfRead() {
    this.failPdfRead = true;
  }
}

