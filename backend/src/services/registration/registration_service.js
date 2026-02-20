import { REGISTRATION_CONFIG } from "../../models/config/registration_config.js";
import { RegistrationRepository } from "../../models/registration_repository.js";
import { mapError, mapValidationErrors } from "../../api/registration_error_mapper.js";
import { hashPassword, validatePassword } from "../security/password_service.js";
import { issueVerificationToken } from "../security/verification_token_service.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function orderedValidationErrors({ email, password, confirmPassword, repository }) {
  const errors = [];
  const normalizedEmail = RegistrationRepository.normalizeEmail(email);

  if (!normalizedEmail) {
    errors.push({ code: "MISSING_EMAIL", field: "email", message: "Email is required." });
  } else if (!EMAIL_REGEX.test(normalizedEmail)) {
    errors.push({ code: "INVALID_EMAIL_FORMAT", field: "email", message: "Email format is invalid." });
  }

  if (!password) {
    errors.push({ code: "MISSING_PASSWORD", field: "password", message: "Password is required." });
  } else {
    errors.push(...validatePassword(password));
  }

  if (!confirmPassword) {
    errors.push({ code: "MISSING_CONFIRM_PASSWORD", field: "confirmPassword", message: "Confirm password is required." });
  } else if (password !== confirmPassword) {
    errors.push({ code: "CONFIRM_PASSWORD_MISMATCH", field: "confirmPassword", message: "Confirm password must match password." });
  }

  if (normalizedEmail && EMAIL_REGEX.test(normalizedEmail)) {
    if (repository.findActiveUserByEmail(normalizedEmail)) {
      errors.push({ code: "EMAIL_ALREADY_REGISTERED", field: "email", message: "Email already in use." });
    } else if (repository.findPendingByEmail(normalizedEmail)) {
      errors.push({ code: "EMAIL_PENDING_REGISTRATION", field: "email", message: "Email already has a pending registration." });
    }
  }

  return errors;
}

export function createRegistration(deps, request) {
  const repository = deps.repository;
  const config = deps.config ?? REGISTRATION_CONFIG;
  const now = deps.nowProvider ? deps.nowProvider() : new Date();
  const body = request.body ?? {};
  const normalizedEmail = RegistrationRepository.normalizeEmail(body.email);

  const errors = orderedValidationErrors({
    email: normalizedEmail,
    password: body.password,
    confirmPassword: body.confirmPassword,
    repository
  });

  if (errors.length > 0) {
    return { status: 422, body: mapValidationErrors(errors) };
  }

  if (!repository.acquireLock(normalizedEmail)) {
    return { status: 409, body: mapError("EMAIL_ALREADY_REGISTERED", "Registration already in progress.") };
  }

  try {
    if (repository.findActiveUserByEmail(normalizedEmail) || repository.findPendingByEmail(normalizedEmail)) {
      return { status: 409, body: mapError("EMAIL_ALREADY_REGISTERED", "Email already in use or pending.") };
    }

    const passwordHash = hashPassword(body.password);
    const expiresAt = new Date(now.getTime() + config.pendingRegistrationTtlDays * 24 * 60 * 60 * 1000);
    const pending = repository.createPendingRegistration({
      email: normalizedEmail,
      passwordHash,
      now,
      expiresAt
    });
    const token = issueVerificationToken({ repository, pendingRegistration: pending, now, config });
    deps.verificationEmailService.sendVerificationEmail({
      email: normalizedEmail,
      token: token.rawToken,
      expiresAt: token.expiresAt
    });
    deps.auditLog?.record("registration_submitted", { email: normalizedEmail });

    return {
      status: 202,
      body: {
        status: "PENDING_VERIFICATION",
        message: "Confirmation link sent to provided email.",
        registration_expires_at: expiresAt.toISOString()
      }
    };
  } finally {
    repository.releaseLock(normalizedEmail);
  }
}
