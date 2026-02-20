import { createRegistrationController } from "./registration_controller.js";
import { createAuthController } from "./auth_controller.js";

export function createRegistrationRoutes(deps) {
  const registrationController = createRegistrationController(deps);
  const authController = createAuthController(deps);

  return {
    "/api/v1/registrations:POST": registrationController.submitRegistration,
    "/api/v1/registrations/verify:GET": registrationController.verifyRegistration,
    "/api/v1/registrations/resend-confirmation:POST": registrationController.resendConfirmation,
    "/api/v1/auth/login:POST": authController.login
  };
}
