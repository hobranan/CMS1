import { createRegistrationRoutes } from "../../backend/src/api/registration_routes.js";
import { RegistrationRepository } from "../../backend/src/models/registration_repository.js";
import { VerificationEmailService } from "../../backend/src/services/email/verification_email_service.js";
import { hashPassword } from "../../backend/src/services/security/password_service.js";

export function createUc10System() {
  const repository = new RegistrationRepository();
  const verificationEmailService = new VerificationEmailService();
  let clock = new Date("2026-02-20T00:00:00.000Z");
  const deps = {
    repository,
    verificationEmailService,
    nowProvider: () => new Date(clock)
  };
  const routes = createRegistrationRoutes(deps);

  function addReferee(email, password = "RefPass!123") {
    const user = repository.createActiveUser({
      email,
      passwordHash: hashPassword(password),
      now: new Date(clock)
    });
    return user;
  }

  function seedInvitation({
    paperId = "paper-1",
    refereeId,
    issuedAtIso = new Date(clock).toISOString(),
    status = "pending"
  }) {
    return deps.reviewInvitationRepository.create({
      paperId,
      refereeId,
      issuedAt: issuedAtIso,
      status
    });
  }

  return {
    deps,
    addReferee,
    seedInvitation,
    setNow(iso) {
      clock = new Date(iso);
    },
    call(routeKey, request = {}) {
      return routes[routeKey](request);
    }
  };
}

