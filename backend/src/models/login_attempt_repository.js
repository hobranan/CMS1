import { RegistrationRepository } from "./registration_repository.js";

export class LoginAttemptRepository {
  constructor() {
    this.attempts = [];
  }

  addAttempt({ email, outcome, now }) {
    this.attempts.push({
      email: RegistrationRepository.normalizeEmail(email),
      outcome,
      at: now.toISOString()
    });
  }
}
