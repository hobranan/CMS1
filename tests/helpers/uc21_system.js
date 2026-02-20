import { createRegistrationRoutes } from "../../backend/src/api/registration_routes.js";
import { RegistrationRepository } from "../../backend/src/models/registration_repository.js";
import { VerificationEmailService } from "../../backend/src/services/email/verification_email_service.js";
import { hashPassword } from "../../backend/src/services/security/password_service.js";

export function createUc21System() {
  const repository = new RegistrationRepository();
  const verificationEmailService = new VerificationEmailService();
  const deps = { repository, verificationEmailService };
  const routes = createRegistrationRoutes(deps);

  function addUser(email, role = "attendee") {
    const user = repository.createActiveUser({
      email,
      passwordHash: hashPassword("Pass!123"),
      now: new Date("2026-02-20T00:00:00.000Z")
    });
    return { ...user, role };
  }

  function seedPaidRegistration(registrationId, attendeeId) {
    deps.paymentWorkflowStore.seedRegistration({
      registrationId,
      attendeeId,
      categoryId: "regular",
      amount: 350,
      currency: "CAD",
      state: "paid_confirmed"
    });
    deps.paymentWorkflowStore.updateRegistration(registrationId, { paymentId: `pay-${registrationId}` });
  }

  function seedPendingRegistration(registrationId, attendeeId) {
    deps.paymentWorkflowStore.seedRegistration({
      registrationId,
      attendeeId,
      categoryId: "regular",
      amount: 350,
      currency: "CAD",
      state: "pending"
    });
  }

  return {
    deps,
    addUser,
    seedPaidRegistration,
    seedPendingRegistration,
    failTicketGeneration() {
      deps.ticketStore.failNextTicketGeneration();
    },
    failTicketStorage() {
      deps.ticketStore.failNextTicketStorage();
    },
    failPdfRead() {
      deps.ticketStore.failNextPdfRead();
    },
    forceDeliveryFailure() {
      deps.ticketStore.forceDeliveryFailure = true;
    },
    call(routeKey, request = {}) {
      return routes[routeKey](request);
    }
  };
}

