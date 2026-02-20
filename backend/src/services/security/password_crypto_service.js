import { hashPassword, verifyPassword } from "./password_service.js";

export function hashSecret(password) {
  return hashPassword(password);
}

export function compareSecret(password, hash) {
  return verifyPassword(password, hash);
}
