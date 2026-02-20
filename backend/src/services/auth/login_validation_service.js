import { RegistrationRepository } from "../../models/registration_repository.js";

export function validateLoginPayload(payload) {
  const errors = [];
  const email = RegistrationRepository.normalizeEmail(payload?.email);
  const password = String(payload?.password ?? "");
  if (!email) {
    errors.push({ field: "email", code: "REQUIRED", message: "Email is required." });
  }
  if (!password) {
    errors.push({ field: "password", code: "REQUIRED", message: "Password is required." });
  }
  return { email, password, errors };
}
