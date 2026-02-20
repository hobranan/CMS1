import { asRegistrationPaymentAttempt } from "./registration-payment-attempt.js";
import { asPaymentRecord } from "./payment-record.js";
import { asRegistrationStatus } from "./registration-status.js";
import { asReconciliationItem } from "./reconciliation-item.js";

export class PaymentWorkflowStore {
  constructor() {
    this.registrations = new Map();
    this.attempts = new Map();
    this.paymentRecords = new Map();
    this.reconciliationItems = new Map();
    this.failNextPaymentPersist = false;
  }

  seedRegistration(payload) {
    const registration = asRegistrationStatus({
      registrationId: payload.registrationId,
      state: payload.state ?? "unpaid"
    });
    registration.attendeeId = payload.attendeeId;
    registration.categoryId = payload.categoryId ?? null;
    registration.amount = Number(payload.amount ?? 0);
    registration.currency = payload.currency ?? "CAD";
    this.registrations.set(registration.registrationId, registration);
    return registration;
  }

  getRegistration(registrationId) {
    return this.registrations.get(registrationId) ?? null;
  }

  updateRegistration(registrationId, patch) {
    const registration = this.getRegistration(registrationId);
    if (!registration) return null;
    Object.assign(registration, patch, { updatedAt: new Date().toISOString() });
    return registration;
  }

  createAttempt(payload) {
    const attempt = asRegistrationPaymentAttempt(payload);
    this.attempts.set(attempt.attemptId, attempt);
    return attempt;
  }

  getAttempt(attemptId) {
    return this.attempts.get(attemptId) ?? null;
  }

  updateAttempt(attemptId, patch) {
    const attempt = this.getAttempt(attemptId);
    if (!attempt) return null;
    Object.assign(attempt, patch);
    return attempt;
  }

  createPaymentRecord(payload) {
    if (this.failNextPaymentPersist) {
      this.failNextPaymentPersist = false;
      const err = new Error("PAYMENT_RECORD_PERSISTENCE_FAILED");
      err.code = "PAYMENT_RECORD_PERSISTENCE_FAILED";
      throw err;
    }
    const record = asPaymentRecord(payload);
    this.paymentRecords.set(record.paymentId, record);
    return record;
  }

  createReconciliationItem(payload) {
    const item = asReconciliationItem(payload);
    this.reconciliationItems.set(item.reconciliationId, item);
    return item;
  }

  failNextPersist() {
    this.failNextPaymentPersist = true;
  }
}

