import { applyRegistrationPaymentState } from "./registration-payment-state-service.js";

export function createReconciliationForPersistFailure(store, attempt) {
  const registration = applyRegistrationPaymentState(
    store,
    attempt.registrationId,
    "pending",
    { message: "Payment could not be confirmed in CMS and requires reconciliation." }
  );
  const reconciliationItem = store.createReconciliationItem({
    attemptId: attempt.attemptId,
    reason: "gateway_success_persist_failed"
  });
  return { registration, reconciliationItem };
}

