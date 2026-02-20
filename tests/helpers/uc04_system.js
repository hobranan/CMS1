import { createRegistrationRoutes } from "../../backend/src/api/registration_routes.js";
import { RegistrationRepository } from "../../backend/src/models/registration_repository.js";
import { VerificationEmailService } from "../../backend/src/services/email/verification_email_service.js";
import { hashPassword } from "../../backend/src/services/security/password_service.js";

export function createUc04System() {
  const repository = new RegistrationRepository();
  const verificationEmailService = new VerificationEmailService();
  let clock = new Date("2026-02-20T00:00:00.000Z");

  const deps = {
    repository,
    verificationEmailService,
    nowProvider: () => new Date(clock)
  };
  const routes = createRegistrationRoutes(deps);

  function addUser(email, password) {
    repository.createActiveUser({
      email,
      passwordHash: hashPassword(password),
      now: new Date(clock)
    });
  }

  function login(email, password) {
    return routes["/api/v1/auth/login:POST"]({ body: { email, password } });
  }

  return {
    deps,
    addUser,
    login,
    setNow(iso) {
      clock = new Date(iso);
    },
    call(routeKey, request = {}) {
      return routes[routeKey](request);
    }
  };
}
