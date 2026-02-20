import { createRegistrationController } from "./registration_controller.js";
import { createAuthController } from "./auth_controller.js";
import { createLoginRoutes } from "./login_routes.js";
import { CredentialStoreRepository } from "../models/credential_store_repository.js";
import { LockoutStateRepository } from "../models/lockout_state_repository.js";
import { LoginAttemptRepository } from "../models/login_attempt_repository.js";
import { SessionService } from "../services/auth/session_service.js";
import { LoginObservabilityService } from "../services/auth/login_observability_service.js";

export function createRegistrationRoutes(deps) {
  if (!deps.credentialStoreRepository) {
    deps.credentialStoreRepository = new CredentialStoreRepository(deps.repository);
  }
  if (!deps.lockoutStateRepository) {
    deps.lockoutStateRepository = new LockoutStateRepository();
  }
  if (!deps.loginAttemptRepository) {
    deps.loginAttemptRepository = new LoginAttemptRepository();
  }
  if (!deps.sessionService) {
    deps.sessionService = new SessionService();
  }
  if (!deps.loginObservabilityService) {
    deps.loginObservabilityService = new LoginObservabilityService();
  }

  const registrationController = createRegistrationController(deps);
  const authController = createAuthController(deps);
  const loginRoutes = createLoginRoutes(deps);

  return {
    "/api/v1/registrations:POST": registrationController.submitRegistration,
    "/api/v1/registrations/verify:GET": registrationController.verifyRegistration,
    "/api/v1/registrations/resend-confirmation:POST": registrationController.resendConfirmation,
    "/api/v1/auth/login:POST": authController.login,
    ...loginRoutes
  };
}
