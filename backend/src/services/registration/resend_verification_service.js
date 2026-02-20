import { REGISTRATION_CONFIG } from "../../models/config/registration_config.js";
import { RegistrationRepository } from "../../models/registration_repository.js";
import { mapError } from "../../api/registration_error_mapper.js";
import { issueVerificationToken } from "../security/verification_token_service.js";
import { isPendingExpired } from "./registration_expiry_service.js";

export function resendVerification(deps, request) {
  const config = deps.config ?? REGISTRATION_CONFIG;
  const now = deps.nowProvider ? deps.nowProvider() : new Date();
  const email = RegistrationRepository.normalizeEmail(request.body?.email);
  const pending = deps.repository.findPendingByEmail(email);

  if (!pending) {
    return { status: 404, body: mapError("PENDING_REGISTRATION_NOT_FOUND", "No pending registration found.") };
  }
  if (isPendingExpired(pending, now)) {
    deps.repository.markPendingExpired(email);
    return { status: 410, body: mapError("REGISTRATION_ATTEMPT_EXPIRED", "Pending registration has expired.") };
  }
  if (pending.status !== "PENDING_VERIFICATION") {
    return { status: 410, body: mapError("REGISTRATION_NOT_RESENDABLE", "Registration is not eligible for resend.") };
  }

  const cutoff = now.getTime() - config.resendWindowHours * 60 * 60 * 1000;
  pending.resendAttempts = pending.resendAttempts.filter((time) => new Date(time).getTime() >= cutoff);
  if (pending.resendAttempts.length >= config.resendMaxAttempts) {
    return { status: 429, body: mapError("RESEND_RATE_LIMITED", "Too many resend attempts.") };
  }
  const latest = pending.resendAttempts[pending.resendAttempts.length - 1];
  if (latest && now.getTime() - new Date(latest).getTime() < config.resendCooldownSeconds * 1000) {
    return { status: 429, body: mapError("RESEND_COOLDOWN_ACTIVE", "Please wait before requesting another resend.") };
  }

  const token = issueVerificationToken({ repository: deps.repository, pendingRegistration: pending, now, config });
  deps.verificationEmailService.sendVerificationEmail({
    email: pending.email,
    token: token.rawToken,
    expiresAt: token.expiresAt
  });
  pending.resendAttempts.push(now.toISOString());
  deps.auditLog?.record("verification_resent", { email: pending.email });

  return {
    status: 202,
    body: { status: "PENDING_VERIFICATION" }
  };
}
