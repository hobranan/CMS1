import { createRegistrationRoutes } from "../../backend/src/api/registration_routes.js";
import { RegistrationRepository } from "../../backend/src/models/registration_repository.js";
import { VerificationEmailService } from "../../backend/src/services/email/verification_email_service.js";
import { hashPassword } from "../../backend/src/services/security/password_service.js";

export function createUc17System() {
  const repository = new RegistrationRepository();
  const verificationEmailService = new VerificationEmailService();
  const deps = { repository, verificationEmailService };
  const routes = createRegistrationRoutes(deps);

  function addEditor(email, role = "editor") {
    const user = repository.createActiveUser({ email, passwordHash: hashPassword("EditorPass!123"), now: new Date("2026-02-20T00:00:00.000Z") });
    return { ...user, role };
  }

  return {
    deps,
    addEditor,
    seedConference(input) { deps.scheduleDraftRepository.seedConference(input); },
    seedPublishedSchedule({ conferenceId, schedule }) {
      deps.scheduleDraftRepository.publishedByConference.set(conferenceId, { ...schedule, conferenceId, status: "published" });
      deps.scheduleEditVersions.set(conferenceId, 1);
    },
    failNextEditSave() { deps.scheduleDraftRepository.failNextScheduleEditSave(); },
    call(routeKey, request = {}) { return routes[routeKey](request); }
  };
}
