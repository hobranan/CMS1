import { createRegistrationRoutes } from "../../backend/src/api/registration_routes.js";
import { RegistrationRepository } from "../../backend/src/models/registration_repository.js";
import { VerificationEmailService } from "../../backend/src/services/email/verification_email_service.js";
import { hashPassword } from "../../backend/src/services/security/password_service.js";

export function createUc20System() {
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

  function seedRegistration({
    registrationId,
    attendeeId,
    categoryId = "standard",
    amount = 350,
    currency = "CAD",
    state = "unpaid"
  }) {
    return deps.paymentWorkflowStore.seedRegistration({
      registrationId,
      attendeeId,
      categoryId,
      amount,
      currency,
      state
    });
  }

  return {
    deps,
    addUser,
    seedRegistration,
    failPaymentPersist() {
      deps.paymentWorkflowStore.failNextPersist();
    },
    getReconciliationItems() {
      return Array.from(deps.paymentWorkflowStore.reconciliationItems.values());
    },
    call(routeKey, request = {}) {
      return routes[routeKey](request);
    }
  };
}

