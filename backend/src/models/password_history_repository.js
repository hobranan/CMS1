import { RegistrationRepository } from "./registration_repository.js";

export class PasswordHistoryRepository {
  constructor() {
    this.historyByEmail = new Map();
  }

  getRecentHashes(email, limit = 5) {
    const key = RegistrationRepository.normalizeEmail(email);
    return (this.historyByEmail.get(key) ?? []).slice(0, limit);
  }

  pushHash(email, passwordHash, windowSize = 5) {
    const key = RegistrationRepository.normalizeEmail(email);
    const current = this.historyByEmail.get(key) ?? [];
    const updated = [passwordHash, ...current].slice(0, windowSize);
    this.historyByEmail.set(key, updated);
    return updated;
  }
}
