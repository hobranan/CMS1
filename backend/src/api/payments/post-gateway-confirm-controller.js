import { asGatewayConfirmationEvent } from "../../models/gateway-confirmation-event.js";
import { isGatewaySignatureValid } from "../../services/payments/gateway-signature-verification-service.js";
import { handleNonSuccessPaymentOutcome } from "../../services/payments/non-success-payment-outcome-service.js";
import { persistPaymentRecord } from "../../services/payments/payment-record-persistence-service.js";
import { applyRegistrationPaymentState } from "../../services/payments/registration-payment-state-service.js";
import { resolvePaymentTimeout } from "../../services/payments/payment-timeout-resolution-service.js";
import { createReconciliationForPersistFailure } from "../../services/payments/payment-reconciliation-service.js";
import { mapGatewayOutcome } from "./payment-outcome-feedback-mapper.js";
import { mapPaymentError } from "./payment-error-mapper.js";

export function createPostGatewayConfirmController(deps) {
  return {
    post(request = {}) {
      const { attemptId, gatewayStatus, gatewayReference, signature } = request.body ?? {};
      if (!attemptId || !gatewayStatus || !gatewayReference || !signature) {
        return mapPaymentError(400, "INVALID_CONFIRMATION_PAYLOAD", "Gateway confirmation payload is incomplete.");
      }

      const attempt = deps.paymentWorkflowStore.getAttempt(attemptId);
      if (!attempt) {
        return mapPaymentError(400, "UNKNOWN_PAYMENT_ATTEMPT", "Payment attempt was not found.");
      }

      try {
        asGatewayConfirmationEvent({
          attemptId,
          gatewayStatus,
          payloadSignatureValid: isGatewaySignatureValid(signature)
        });
      } catch {
        return mapPaymentError(400, "INVALID_GATEWAY_STATUS", "Gateway status is not supported.");
      }

      if (!isGatewaySignatureValid(signature)) {
        return mapPaymentError(400, "INVALID_GATEWAY_SIGNATURE", "Gateway signature could not be verified.");
      }

      const registration = deps.paymentWorkflowStore.getRegistration(attempt.registrationId);
      if (!registration) {
        return mapPaymentError(404, "REGISTRATION_NOT_FOUND", "Registration not found.");
      }

      if (gatewayStatus === "success") {
        if (registration.state === "paid_confirmed") {
          return mapPaymentError(409, "DUPLICATE_PAYMENT_ATTEMPT", "Registration is already paid and confirmed.");
        }
        try {
          const paymentRecord = persistPaymentRecord(deps.paymentWorkflowStore, {
            attempt,
            registration,
            gatewayReference
          });
          deps.paymentWorkflowStore.updateAttempt(attemptId, {
            status: "confirmed",
            gatewayReference
          });
          const updatedRegistration = applyRegistrationPaymentState(
            deps.paymentWorkflowStore,
            registration.registrationId,
            "paid_confirmed",
            {
              paymentId: paymentRecord.paymentId,
              message: "Payment confirmed. Registration is now paid."
            }
          );
          deps.paymentObservabilityService?.record("payment_confirmed");
          return {
            status: 200,
            body: {
              attemptId,
              registrationState: updatedRegistration.state,
              outcome: "confirmed",
              paymentId: paymentRecord.paymentId,
              reconciliationId: null
            }
          };
        } catch {
          const unresolved = createReconciliationForPersistFailure(deps.paymentWorkflowStore, attempt);
          deps.paymentObservabilityService?.record("payment_reconciliation_required");
          return mapPaymentError(
            500,
            "PAYMENT_RECONCILIATION_REQUIRED",
            "Payment was successful at gateway but could not be recorded.",
            { reconciliationId: unresolved.reconciliationItem.reconciliationId }
          );
        }
      }

      if (gatewayStatus === "timeout") {
        const unresolved = resolvePaymentTimeout(deps.paymentWorkflowStore, attempt);
        deps.paymentObservabilityService?.record("payment_unresolved_timeout");
        return {
          status: 200,
          body: {
            attemptId,
            registrationState: unresolved.registration.state,
            outcome: mapGatewayOutcome(gatewayStatus),
            reconciliationId: unresolved.reconciliationItem.reconciliationId
          }
        };
      }

      const nonSuccess = handleNonSuccessPaymentOutcome(deps.paymentWorkflowStore, {
        attempt,
        gatewayStatus,
        gatewayReference
      });
      deps.paymentObservabilityService?.record(`payment_${nonSuccess.outcome}`);
      return {
        status: 200,
        body: {
          attemptId,
          registrationState: nonSuccess.registration.state,
          outcome: mapGatewayOutcome(gatewayStatus),
          reconciliationId: null
        }
      };
    }
  };
}

