import { createRegistrationRoutes } from "../../backend/src/api/registration_routes.js";
import { RegistrationRepository } from "../../backend/src/models/registration_repository.js";
import { VerificationEmailService } from "../../backend/src/services/email/verification_email_service.js";
import { hashPassword } from "../../backend/src/services/security/password_service.js";

export function createUc14System() {
  const repository = new RegistrationRepository();
  const verificationEmailService = new VerificationEmailService();
  const deps = { repository, verificationEmailService, nowProvider: () => new Date("2026-02-20T00:00:00.000Z") };
  const routes = createRegistrationRoutes(deps);

  function addEditor(email, password = "EditorPass!123") {
    return repository.createActiveUser({ email, passwordHash: hashPassword(password), now: new Date("2026-02-20T00:00:00.000Z") });
  }

  return {
    deps,
    addEditor,
    seedPaper(input) { deps.paperDecisionRepository.seedPaper(input); },
    failNextSave() { deps.paperDecisionRepository.failNextDecisionSave(); },
    failNextNotification() { deps.paperDecisionNotificationService.failNextNotification(); },
    call(routeKey, request = {}) { return routes[routeKey](request); }
  };
}
