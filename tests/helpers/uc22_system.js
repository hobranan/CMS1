import { createRegistrationRoutes } from "../../backend/src/api/registration_routes.js";
import { RegistrationRepository } from "../../backend/src/models/registration_repository.js";
import { VerificationEmailService } from "../../backend/src/services/email/verification_email_service.js";

export function createUc22System() {
  const repository = new RegistrationRepository();
  const verificationEmailService = new VerificationEmailService();
  const deps = { repository, verificationEmailService };
  const routes = createRegistrationRoutes(deps);

  return {
    deps,
    seedAnnouncements(items) {
      deps.announcementStore.seedAnnouncements(items);
    },
    markUnavailable(announcementId) {
      deps.announcementStore.markUnavailable(announcementId);
    },
    failListOnce() {
      deps.announcementStore.failListOnce();
    },
    failDetailOnce() {
      deps.announcementStore.failDetailOnce();
    },
    call(routeKey, request = {}) {
      return routes[routeKey](request);
    }
  };
}

