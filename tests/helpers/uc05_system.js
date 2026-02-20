import { createRegistrationRoutes } from "../../backend/src/api/registration_routes.js";
import { RegistrationRepository } from "../../backend/src/models/registration_repository.js";
import { VerificationEmailService } from "../../backend/src/services/email/verification_email_service.js";
import { hashPassword } from "../../backend/src/services/security/password_service.js";

export function createUc05System() {
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

  function validSubmissionPayload() {
    return {
      body: {
        author_names: "Alice Smith; Bob Lee",
        author_affiliations: "University A; Institute B",
        author_contact_email: "alice@example.com",
        author_contact_phone: "+1 (555) 555-1234",
        abstract_text: "Paper abstract text",
        keywords: "security,review,cms",
        main_reference_source: "Primary Journal 2025"
      },
      file: {
        fileName: "paper.pdf",
        contentType: "application/pdf",
        sizeBytes: 1024 * 1024
      }
    };
  }

  return {
    deps,
    addAuthor,
    validSubmissionPayload,
    setNow(iso) {
      clock = new Date(iso);
    },
    call(routeKey, request = {}) {
      return routes[routeKey](request);
    }
  };
}
