import { LOGIN_POLICY_CONFIG } from "../../models/config/login_policy_config.js";

export function isLocked(lockoutRepository, email, now) {
  const state = lockoutRepository.getState(email);
  if (!state.lockoutExpiresAt) {
    return { locked: false, state };
  }
  if (now.getTime() >= new Date(state.lockoutExpiresAt).getTime()) {
    const reset = { failedAttemptCount: 0, lockoutExpiresAt: null };
    lockoutRepository.setState(email, reset);
    return { locked: false, state: reset };
  }
  return { locked: true, state };
}

export function registerFailure(lockoutRepository, email, now, config = LOGIN_POLICY_CONFIG) {
  const state = lockoutRepository.getState(email);
  const failedAttemptCount = state.failedAttemptCount + 1;
  if (failedAttemptCount >= config.failedAttemptThreshold) {
    const lockoutExpiresAt = new Date(now.getTime() + config.lockoutMinutes * 60 * 1000).toISOString();
    const locked = { failedAttemptCount, lockoutExpiresAt };
    lockoutRepository.setState(email, locked);
    return { locked: true, state: locked };
  }
  const updated = { failedAttemptCount, lockoutExpiresAt: null };
  lockoutRepository.setState(email, updated);
  return { locked: false, state: updated };
}

export function resetFailures(lockoutRepository, email) {
  lockoutRepository.setState(email, { failedAttemptCount: 0, lockoutExpiresAt: null });
}
