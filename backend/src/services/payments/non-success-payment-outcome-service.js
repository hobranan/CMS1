import { applyRegistrationPaymentState } from "./registration-payment-state-service.js";

function mapOutcome(gatewayStatus) {
  if (gatewayStatus === "invalid") return "invalid_details";
  if (gatewayStatus === "declined") return "declined";
  return "canceled";
}

export function handleNonSuccessPaymentOutcome(store, { attempt, gatewayStatus, gatewayReference }) {
  const outcome = mapOutcome(gatewayStatus);
  store.updateAttempt(attempt.attemptId, { status: outcome, gatewayReference: gatewayReference ?? null });
  const registration = applyRegistrationPaymentState(
    store,
    attempt.registrationId,
    "unpaid",
    { message: "Payment was not completed. Registration remains unpaid." }
  );
  return { outcome, registration };
}

