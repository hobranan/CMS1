import { createRegistrationRoutes } from "../../backend/src/api/registration_routes.js";
import { RegistrationRepository } from "../../backend/src/models/registration_repository.js";
import { VerificationEmailService } from "../../backend/src/services/email/verification_email_service.js";
import { hashPassword } from "../../backend/src/services/security/password_service.js";

export function createUc08System() {
  const repository = new RegistrationRepository();
  const verificationEmailService = new VerificationEmailService();
  let clock = new Date("2026-02-20T00:00:00.000Z");

  const deps = {
    repository,
    verificationEmailService,
    nowProvider: () => new Date(clock)
  };
  const routes = createRegistrationRoutes(deps);

  function addEditor(email, password = "EditorPass!123") {
    repository.createActiveUser({
      email,
      passwordHash: hashPassword(password),
      now: new Date(clock)
    });
  }

  function seedPaper(paperId = "paper-1") {
    deps.paperRefereeAssignmentRepository.seedPaper({
      paperId,
      status: "SUBMITTED",
      version: 0
    });
    return paperId;
  }

  function seedReferee(refereeId, options = {}) {
    deps.paperRefereeAssignmentRepository.seedReferee({
      refereeId,
      eligible: options.eligible ?? true,
      currentLoad: options.currentLoad ?? 0,
      maxLoad: options.maxLoad ?? 3
    });
  }

  return {
    deps,
    addEditor,
    seedPaper,
    seedReferee,
    setNow(iso) {
      clock = new Date(iso);
    },
    call(routeKey, request = {}) {
      return routes[routeKey](request);
    }
  };
}

