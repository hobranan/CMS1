import { createRegistrationRoutes } from "../../backend/src/api/registration_routes.js";
import { RegistrationRepository } from "../../backend/src/models/registration_repository.js";
import { VerificationEmailService } from "../../backend/src/services/email/verification_email_service.js";
import { hashPassword } from "../../backend/src/services/security/password_service.js";

export function createUc13System() {
  const repository = new RegistrationRepository();
  const verificationEmailService = new VerificationEmailService();
  const deps = { repository, verificationEmailService };
  const routes = createRegistrationRoutes(deps);

  function addEditor(email, password = "EditorPass!123") {
    return repository.createActiveUser({
      email,
      passwordHash: hashPassword(password),
      now: new Date("2026-02-20T00:00:00.000Z")
    });
  }

  function addReferee(email, password = "RefPass!123") {
    return repository.createActiveUser({
      email,
      passwordHash: hashPassword(password),
      now: new Date("2026-02-20T00:00:00.000Z")
    });
  }

  return {
    deps,
    addEditor,
    addReferee,
    seedAssignment(input) {
      deps.reviewSubmissionRepository.seedAssignment(input);
    },
    seedSubmittedReview(input) {
      return deps.reviewSubmissionRepository.createSubmittedReview(input);
    },
    seedDraft(input) {
      deps.reviewSubmissionRepository.seedDraft(input);
    },
    call(routeKey, request = {}) {
      return routes[routeKey](request);
    }
  };
}


