import { REGISTRATION_CONFIG } from "../../backend/src/models/config/registration_config.js";
import { RegistrationRepository } from "../../backend/src/models/registration_repository.js";
import { VerificationEmailService } from "../../backend/src/services/email/verification_email_service.js";
import { RegistrationAuditLog } from "../../backend/src/services/registration/registration_audit_log.js";
import { createRegistrationRoutes } from "../../backend/src/api/registration_routes.js";

export function createUc01System() {
  const repository = new RegistrationRepository();
  const verificationEmailService = new VerificationEmailService();
  const auditLog = new RegistrationAuditLog();
  let clock = new Date("2026-02-20T00:00:00.000Z");

  const deps = {
    repository,
    verificationEmailService,
    config: REGISTRATION_CONFIG,
    auditLog,
    nowProvider: () => new Date(clock)
  };
  const routes = createRegistrationRoutes(deps);

  function setNow(iso) {
    clock = new Date(iso);
  }

  function advanceMs(ms) {
    clock = new Date(clock.getTime() + ms);
  }

  function call(routeKey, request = {}) {
    const handler = routes[routeKey];
    if (!handler) {
      throw new Error(`Missing route ${routeKey}`);
    }
    return handler(request);
  }

  return {
    repository,
    verificationEmailService,
    auditLog,
    setNow,
    advanceMs,
    call
  };
}
