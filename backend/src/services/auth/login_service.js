import { RegistrationRepository } from "../../models/registration_repository.js";
import { verifyPassword } from "../security/password_service.js";
import { isPendingExpired } from "../registration/registration_expiry_service.js";

export function login(deps, request) {
  const now = deps.nowProvider ? deps.nowProvider() : new Date();
  const email = RegistrationRepository.normalizeEmail(request.body?.email);
  const password = String(request.body?.password ?? "");

  const user = deps.repository.findActiveUserByEmail(email);
  if (user && verifyPassword(password, user.passwordHash)) {
    return { status: 200, body: { status: "AUTHENTICATED" } };
  }

  const pending = deps.repository.findPendingByEmail(email);
  if (pending && verifyPassword(password, pending.passwordHash)) {
    if (isPendingExpired(pending, now)) {
      deps.repository.markPendingExpired(email);
      return {
        status: 403,
        body: {
          code: "REGISTRATION_ATTEMPT_EXPIRED",
          message: "Pending registration expired. Start a new registration.",
          resend_available: false
        }
      };
    }
    return {
      status: 403,
      body: {
        code: "EMAIL_UNVERIFIED",
        message: "Verify your email using the confirmation message we sent.",
        resend_available: true,
        resend_endpoint: "/api/v1/registrations/resend-confirmation"
      }
    };
  }

  return {
    status: 401,
    body: {
      code: "INVALID_CREDENTIALS",
      message: "Invalid credentials."
    }
  };
}
