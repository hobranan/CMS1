import { PASSWORD_POLICY_CONFIG } from "../../models/config/password_policy_config.js";
import { compareSecret } from "./password_crypto_service.js";

export function validateNewPassword({
  newPassword,
  currentPassword,
  currentPasswordHash,
  recentHistoryHashes,
  config = PASSWORD_POLICY_CONFIG
}) {
  const errors = [];
  const value = String(newPassword ?? "");

  if (value.length < config.minLength) {
    errors.push({ code: "PASSWORD_TOO_SHORT", field: "new_password", message: "New password must be at least 12 characters." });
  }
  if (config.requireUpper && !/[A-Z]/.test(value)) {
    errors.push({ code: "PASSWORD_MISSING_UPPERCASE", field: "new_password", message: "New password must include an uppercase letter." });
  }
  if (config.requireLower && !/[a-z]/.test(value)) {
    errors.push({ code: "PASSWORD_MISSING_LOWERCASE", field: "new_password", message: "New password must include a lowercase letter." });
  }
  if (config.requireNumber && !/[0-9]/.test(value)) {
    errors.push({ code: "PASSWORD_MISSING_NUMBER", field: "new_password", message: "New password must include a number." });
  }
  if (config.requireSpecial && !/[^A-Za-z0-9]/.test(value)) {
    errors.push({ code: "PASSWORD_MISSING_SPECIAL", field: "new_password", message: "New password must include a special character." });
  }
  if (config.forbidSpaces && /\s/.test(value)) {
    errors.push({ code: "PASSWORD_CONTAINS_SPACES", field: "new_password", message: "New password cannot contain spaces." });
  }
  if (value === String(currentPassword ?? "")) {
    errors.push({ code: "NEW_EQUALS_CURRENT", field: "new_password", message: "New password must differ from current password." });
  }
  if (currentPasswordHash && compareSecret(value, currentPasswordHash)) {
    errors.push({ code: "NEW_EQUALS_CURRENT", field: "new_password", message: "New password must differ from current password." });
  }
  if ((recentHistoryHashes ?? []).some((hash) => compareSecret(value, hash))) {
    errors.push({ code: "PASSWORD_HISTORY_REUSE", field: "new_password", message: "New password cannot match your last 5 passwords." });
  }

  return errors;
}
