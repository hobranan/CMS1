import { credentialStoreUnavailable, lockout, missingFields } from "../../api/login_error_mapper.js";
import { isPendingExpired } from "../registration/registration_expiry_service.js";
import { isMatchingPassword } from "../security/password_verifier.js";
import { genericInvalidCredentialFailure } from "./login_failure_service.js";
import { isLocked, registerFailure, resetFailures } from "./lockout_policy_service.js";
import { validateLoginPayload } from "./login_validation_service.js";

export function login(deps, request) {
  const now = deps.nowProvider ? deps.nowProvider() : new Date();
  const parsed = validateLoginPayload(request.body);
  if (parsed.errors.length > 0) {
    return missingFields(parsed.errors);
  }

  const email = parsed.email;
  const password = parsed.password;

  const lockState = isLocked(deps.lockoutStateRepository, email, now);
  if (lockState.locked) {
    deps.loginAttemptRepository?.addAttempt({ email, outcome: "LOCKED", now });
    deps.loginObservabilityService?.record("login_locked", { email });
    return lockout(lockState.state.lockoutExpiresAt);
  }

  let user = null;
  try {
    user = deps.credentialStoreRepository
      ? deps.credentialStoreRepository.findByEmail(email)
      : deps.repository.findActiveUserByEmail(email);
  } catch {
    deps.loginAttemptRepository?.addAttempt({ email, outcome: "STORE_UNAVAILABLE", now });
    deps.loginObservabilityService?.record("login_store_unavailable", { email });
    return credentialStoreUnavailable();
  }

  if (user && isMatchingPassword(password, user.passwordHash)) {
    resetFailures(deps.lockoutStateRepository, email);
    const sessionId = deps.sessionService?.createSession(email, now);
    deps.loginAttemptRepository?.addAttempt({ email, outcome: "SUCCESS", now });
    deps.loginObservabilityService?.record("login_success", { email });
    return {
      status: 200,
      body: {
        status: "AUTHENTICATED",
        redirect: "/dashboard",
        session_id: sessionId
      }
    };
  }

  const pending = deps.repository.findPendingByEmail(email);
  if (pending && isMatchingPassword(password, pending.passwordHash)) {
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

  const failure = registerFailure(deps.lockoutStateRepository, email, now);
  deps.loginAttemptRepository?.addAttempt({ email, outcome: "INVALID_CREDENTIALS", now });
  deps.loginObservabilityService?.record("login_invalid_credentials", { email });
  if (failure.locked) {
    return lockout(failure.state.lockoutExpiresAt);
  }
  return genericInvalidCredentialFailure();
}
