export function isPaymentConfirmedAndRecorded(registration) {
  return registration?.state === "paid_confirmed" && Boolean(registration?.paymentId);
}

