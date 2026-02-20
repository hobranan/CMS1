import { evaluatePaymentInitiationEligibility } from "../../services/payments/payment-initiation-eligibility-service.js";
import { mapPaymentError } from "./payment-error-mapper.js";

export function createPostPaymentInitiateController(deps) {
  return {
    post(request = {}) {
      const userId = request.user?.id;
      if (!userId) {
        return mapPaymentError(401, "AUTHENTICATION_REQUIRED", "Authentication is required.");
      }

      const registrationId = request.params?.registrationId;
      const categoryId = request.body?.categoryId;
      const result = evaluatePaymentInitiationEligibility(deps.paymentWorkflowStore, { registrationId, userId, categoryId });
      if (!result.ok) {
        return mapPaymentError(result.status, result.code, result.message);
      }

      const registration = result.registration;
      const attempt = deps.paymentWorkflowStore.createAttempt({
        attendeeId: userId,
        registrationId,
        categoryId: result.categoryId,
        amount: registration.amount,
        currency: registration.currency,
        status: "initiated"
      });
      deps.paymentObservabilityService?.record("payment_initiated");

      return {
        status: 200,
        body: {
          attemptId: attempt.attemptId,
          amount: registration.amount,
          currency: registration.currency,
          gatewayRedirectUrl: `https://gateway.example.test/checkout?attemptId=${attempt.attemptId}`,
          registrationState: registration.state
        }
      };
    }
  };
}

