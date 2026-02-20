export function persistPaymentRecord(store, { attempt, registration, gatewayReference }) {
  const paymentRecord = store.createPaymentRecord({
    attemptId: attempt.attemptId,
    registrationId: registration.registrationId,
    gatewayReference,
    amount: registration.amount,
    currency: registration.currency
  });
  return paymentRecord;
}

