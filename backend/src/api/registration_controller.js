import { createRegistration } from "../services/registration/registration_service.js";
import { verifyRegistration } from "../services/registration/verification_service.js";
import { resendVerification } from "../services/registration/resend_verification_service.js";

export function createRegistrationController(deps) {
  return {
    submitRegistration: (request) => createRegistration(deps, request),
    verifyRegistration: (request) => verifyRegistration(deps, request),
    resendConfirmation: (request) => resendVerification(deps, request)
  };
}
