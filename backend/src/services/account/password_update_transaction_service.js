import { PASSWORD_POLICY_CONFIG } from "../../models/config/password_policy_config.js";

export function updatePasswordAndHistory({
  credentialRepository,
  passwordHistoryRepository,
  email,
  newPasswordHash,
  now,
  historyWindow = PASSWORD_POLICY_CONFIG.historyWindow
}) {
  const existingUser = credentialRepository.getUserByEmail(email);
  if (!existingUser) {
    throw new Error("Account not found");
  }
  passwordHistoryRepository.pushHash(email, existingUser.passwordHash, historyWindow);
  const user = credentialRepository.updatePasswordHash(email, newPasswordHash, now);
  if (!user) {
    throw new Error("Account not found");
  }
  passwordHistoryRepository.pushHash(email, newPasswordHash, historyWindow);
  return user;
}
