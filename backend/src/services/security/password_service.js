import crypto from "node:crypto";

const COMMON_PASSWORDS = new Set([
  "password",
  "password123",
  "qwerty123",
  "1234567890",
  "letmein123"
]);

export function validatePassword(password) {
  const value = String(password ?? "");
  const errors = [];

  if (value.length < 12) {
    errors.push({ code: "PASSWORD_TOO_SHORT", field: "password", message: "Password must be at least 12 characters." });
  }
  if (!/[A-Z]/.test(value)) {
    errors.push({ code: "PASSWORD_MISSING_UPPERCASE", field: "password", message: "Password must include an uppercase letter." });
  }
  if (!/[a-z]/.test(value)) {
    errors.push({ code: "PASSWORD_MISSING_LOWERCASE", field: "password", message: "Password must include a lowercase letter." });
  }
  if (!/[0-9]/.test(value)) {
    errors.push({ code: "PASSWORD_MISSING_NUMBER", field: "password", message: "Password must include a number." });
  }
  if (!/[^A-Za-z0-9]/.test(value)) {
    errors.push({ code: "PASSWORD_MISSING_SYMBOL", field: "password", message: "Password must include a symbol." });
  }
  if (value.trim() !== value) {
    errors.push({ code: "PASSWORD_HAS_EDGE_SPACES", field: "password", message: "Password cannot start or end with spaces." });
  }
  if (COMMON_PASSWORDS.has(value.toLowerCase())) {
    errors.push({ code: "PASSWORD_COMMON_OR_BREACHED", field: "password", message: "Password is too common." });
  }

  return errors;
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const digest = crypto.pbkdf2Sync(password, salt, 10000, 32, "sha256").toString("hex");
  return `${salt}:${digest}`;
}

export function verifyPassword(password, passwordHash) {
  if (!passwordHash || !passwordHash.includes(":")) return false;
  const [salt, digest] = passwordHash.split(":");
  const candidate = crypto.pbkdf2Sync(password, salt, 10000, 32, "sha256").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(digest, "hex"), Buffer.from(candidate, "hex"));
}
