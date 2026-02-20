import { RegistrationRepository } from "./registration_repository.js";

export class LockoutStateRepository {
  constructor() {
    this.states = new Map();
  }

  getState(email) {
    const key = RegistrationRepository.normalizeEmail(email);
    return this.states.get(key) ?? { failedAttemptCount: 0, lockoutExpiresAt: null };
  }

  setState(email, state) {
    const key = RegistrationRepository.normalizeEmail(email);
    this.states.set(key, state);
    return state;
  }
}
