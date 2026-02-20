import { createRegistrationRoutes } from "../../backend/src/api/registration_routes.js";
import { RegistrationRepository } from "../../backend/src/models/registration_repository.js";
import { VerificationEmailService } from "../../backend/src/services/email/verification_email_service.js";
import { hashPassword } from "../../backend/src/services/security/password_service.js";

export function createUc06System() {
  const repository = new RegistrationRepository();
  const verificationEmailService = new VerificationEmailService();
  let clock = new Date("2026-02-20T00:00:00.000Z");
  const deps = {
    repository,
    verificationEmailService,
    nowProvider: () => new Date(clock)
  };
  const routes = createRegistrationRoutes(deps);

  function addAuthor(email, password = "AuthorPass!123") {
    repository.createActiveUser({
      email,
      passwordHash: hashPassword(password),
      now: new Date(clock)
    });
  }

  function createDraftSubmission(authorEmail) {
    return deps.paperSubmissionRepository.createDraft({
      authorEmail,
      metadata: { title: "Draft" },
      manuscriptFile: null,
      now: new Date(clock)
    });
  }

  function validFile(name = "paper.final.v2.pdf", sizeBytes = 1024 * 1024) {
    return {
      fileName: name,
      contentType: "application/octet-stream",
      sizeBytes
    };
  }

  return {
    deps,
    addAuthor,
    createDraftSubmission,
    validFile,
    setNow(iso) {
      clock = new Date(iso);
    },
    advanceMs(ms) {
      clock = new Date(clock.getTime() + ms);
    },
    call(routeKey, request = {}) {
      return routes[routeKey](request);
    }
  };
}
