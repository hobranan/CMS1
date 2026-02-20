import { createRegistrationRoutes } from "../../backend/src/api/registration_routes.js";
import { RegistrationRepository } from "../../backend/src/models/registration_repository.js";
import { VerificationEmailService } from "../../backend/src/services/email/verification_email_service.js";
import { hashPassword } from "../../backend/src/services/security/password_service.js";

export function createUc19System() {
  const repository = new RegistrationRepository();
  const verificationEmailService = new VerificationEmailService();
  const deps = { repository, verificationEmailService };
  const routes = createRegistrationRoutes(deps);

  function addUser(email, role = "author") {
    const user = repository.createActiveUser({ email, passwordHash: hashPassword("Pass!123"), now: new Date("2026-02-20T00:00:00.000Z") });
    return { ...user, role };
  }

  return {
    deps,
    addUser,
    seedPublishedPricing(payload) { deps.scheduleDraftRepository.seedPublishedPricing(payload); },
    clearPublishedPricing() { deps.scheduleDraftRepository.clearPublishedPricing(); },
    failPricingRead() { deps.scheduleDraftRepository.failNextPricingRead(); },
    call(routeKey, request = {}) { return routes[routeKey](request); }
  };
}
