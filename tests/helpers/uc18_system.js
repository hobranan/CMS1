import { createRegistrationRoutes } from "../../backend/src/api/registration_routes.js";
import { RegistrationRepository } from "../../backend/src/models/registration_repository.js";
import { VerificationEmailService } from "../../backend/src/services/email/verification_email_service.js";

export function createUc18System() {
  const repository = new RegistrationRepository();
  const verificationEmailService = new VerificationEmailService();
  const deps = { repository, verificationEmailService };
  const routes = createRegistrationRoutes(deps);

  return {
    deps,
    seedPublishedSchedule({ conferenceId, entries, publicPolicy = {} }) {
      deps.scheduleDraftRepository.publishedByConference.set(conferenceId, {
        conferenceId,
        status: "published",
        entries,
        publicPolicy
      });
    },
    failScheduleRead() { deps.scheduleDraftRepository.failNextPublicSchedule(); },
    failEntryRead() { deps.scheduleDraftRepository.failNextPublicEntry(); },
    failPdfRead() { deps.scheduleDraftRepository.failNextPublicPdf(); },
    call(routeKey, request = {}) { return routes[routeKey](request); }
  };
}
