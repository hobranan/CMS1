import { verifyPassword } from "./password_service.js";

export function isMatchingPassword(password, passwordHash) {
  return verifyPassword(password, passwordHash);
}
