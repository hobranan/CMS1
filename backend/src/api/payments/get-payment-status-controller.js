import { mapPaymentError } from "./payment-error-mapper.js";

export function createGetPaymentStatusController(deps) {
  return {
    get(request = {}) {
      const userId = request.user?.id;
      if (!userId) {
        return mapPaymentError(401, "AUTHENTICATION_REQUIRED", "Authentication is required.");
      }
      const registrationId = request.params?.registrationId;
      const registration = deps.paymentWorkflowStore.getRegistration(registrationId);
      if (!registration || registration.attendeeId !== userId) {
        return mapPaymentError(404, "REGISTRATION_NOT_FOUND", "Registration not found.");
      }
      return {
        status: 200,
        body: {
          registrationId: registration.registrationId,
          registrationState: registration.state,
          paymentId: registration.paymentId ?? null,
          message: registration.message ?? null
        }
      };
    }
  };
}

