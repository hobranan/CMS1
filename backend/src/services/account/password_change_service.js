import { incorrectCurrentPassword, mismatchError, policyViolation, requiredFieldErrors } from "../../api/password_change_error_mapper.js";
import { PASSWORD_POLICY_CONFIG } from "../../models/config/password_policy_config.js";
import { invalidateCurrentSession } from "../auth/session_invalidation_service.js";
import { compareSecret, hashSecret } from "../security/password_crypto_service.js";
import { validateNewPassword } from "../security/password_policy_validator.js";
import { updatePasswordAndHistory } from "./password_update_transaction_service.js";
import { validatePasswordChangePayload } from "./password_change_validation_service.js";
import { mapPasswordChangeFailure } from "./password_change_failure_service.js";

export function changePassword(deps, request) {
  const now = deps.nowProvider ? deps.nowProvider() : new Date();
  const email = request.user?.email;
  if (!email) {
    return { status: 401, body: { code: "AUTH_REQUIRED", message: "Authentication is required." } };
  }

  const parsed = validatePasswordChangePayload(request.body);
  if (parsed.errors.length > 0) {
    deps.passwordChangeObservabilityService?.record("password_change_required_fields", { email });
    return requiredFieldErrors(parsed.errors);
  }
  if (parsed.newPassword !== parsed.confirmNewPassword) {
    deps.passwordChangeObservabilityService?.record("password_change_confirmation_mismatch", { email });
    return mismatchError();
  }

  const user = deps.credentialRepository.getUserByEmail(email);
  if (!user || !compareSecret(parsed.currentPassword, user.passwordHash)) {
    deps.passwordChangeObservabilityService?.record("password_change_incorrect_current", { email });
    return incorrectCurrentPassword();
  }

  const history = deps.passwordHistoryRepository.getRecentHashes(email, PASSWORD_POLICY_CONFIG.historyWindow);
  const policyErrors = validateNewPassword({
    newPassword: parsed.newPassword,
    currentPassword: parsed.currentPassword,
    currentPasswordHash: user.passwordHash,
    recentHistoryHashes: history
  });
  if (policyErrors.length > 0) {
    deps.passwordChangeObservabilityService?.record("password_change_policy_violation", { email, errorCount: policyErrors.length });
    return policyViolation(policyErrors);
  }

  try {
    const newHash = hashSecret(parsed.newPassword);
    updatePasswordAndHistory({
      credentialRepository: deps.credentialRepository,
      passwordHistoryRepository: deps.passwordHistoryRepository,
      email,
      newPasswordHash: newHash,
      now
    });
    invalidateCurrentSession(deps.sessionService, request.sessionId);
    deps.passwordChangeObservabilityService?.record("password_change_success", { email });
    return {
      status: 200,
      body: {
        status: "PASSWORD_CHANGED",
        reauthenticate: true
      }
    };
  } catch {
    deps.passwordChangeObservabilityService?.record("password_change_system_failure", { email });
    return mapPasswordChangeFailure();
  }
}
