import { RegistrationRepository } from "./registration_repository.js";

export class CredentialStoreRepository {
  constructor(registrationRepository) {
    this.registrationRepository = registrationRepository;
    this.available = true;
  }

  setUnavailable(flag) {
    this.available = !flag;
  }

  findByEmail(email) {
    if (!this.available) {
      throw new Error("Credential store unavailable");
    }
    const normalized = RegistrationRepository.normalizeEmail(email);
    return this.registrationRepository.findActiveUserByEmail(normalized);
  }
}
