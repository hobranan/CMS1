import { RegistrationRepository } from "./registration_repository.js";

export class CredentialRepository {
  constructor(registrationRepository) {
    this.registrationRepository = registrationRepository;
    this.failNextUpdate = false;
  }

  getUserByEmail(email) {
    return this.registrationRepository.findActiveUserByEmail(
      RegistrationRepository.normalizeEmail(email)
    );
  }

  updatePasswordHash(email, passwordHash, now) {
    if (this.failNextUpdate) {
      this.failNextUpdate = false;
      throw new Error("Credential store write failed");
    }
    const user = this.getUserByEmail(email);
    if (!user) return null;
    user.passwordHash = passwordHash;
    user.updatedAt = now.toISOString();
    return user;
  }
}
