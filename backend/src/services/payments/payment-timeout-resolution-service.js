import { applyRegistrationPaymentState } from "./registration-payment-state-service.js";

export function resolvePaymentTimeout(store, attempt) {
  store.updateAttempt(attempt.attemptId, { status: "failed" });
  const registration = applyRegistrationPaymentState(
    store,
    attempt.registrationId,
    "pending",
    { message: "Payment confirmation is unresolved. Retry or contact support." }
  );
  const reconciliationItem = store.createReconciliationItem({
    attemptId: attempt.attemptId,
    reason: "confirmation_timeout"
  });
  return { registration, reconciliationItem };
}

