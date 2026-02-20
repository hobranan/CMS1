import { createRegistrationRoutes } from "../../backend/src/api/registration_routes.js";
import { RegistrationRepository } from "../../backend/src/models/registration_repository.js";
import { CredentialStoreRepository } from "../../backend/src/models/credential_store_repository.js";
import { LockoutStateRepository } from "../../backend/src/models/lockout_state_repository.js";
import { LoginAttemptRepository } from "../../backend/src/models/login_attempt_repository.js";
import { SessionService } from "../../backend/src/services/auth/session_service.js";
import { LoginObservabilityService } from "../../backend/src/services/auth/login_observability_service.js";
import { hashPassword } from "../../backend/src/services/security/password_service.js";
import { VerificationEmailService } from "../../backend/src/services/email/verification_email_service.js";

export function createUc03System() {
  const repository = new RegistrationRepository();
  const credentialStoreRepository = new CredentialStoreRepository(repository);
  const lockoutStateRepository = new LockoutStateRepository();
  const loginAttemptRepository = new LoginAttemptRepository();
  const sessionService = new SessionService();
  const loginObservabilityService = new LoginObservabilityService();
  const verificationEmailService = new VerificationEmailService();
  let clock = new Date("2026-02-20T00:00:00.000Z");

  const deps = {
    repository,
    credentialStoreRepository,
    lockoutStateRepository,
    loginAttemptRepository,
    sessionService,
    loginObservabilityService,
    verificationEmailService,
    nowProvider: () => new Date(clock)
  };
  const routes = createRegistrationRoutes(deps);

  function setNow(iso) {
    clock = new Date(iso);
  }

  function advanceMs(ms) {
    clock = new Date(clock.getTime() + ms);
  }

  function addUser(email, password) {
    repository.createActiveUser({
      email,
      passwordHash: hashPassword(password),
      now: new Date(clock)
    });
  }

  return {
    deps,
    setNow,
    advanceMs,
    addUser,
    call(routeKey, request = {}) {
      return routes[routeKey](request);
    }
  };
}
