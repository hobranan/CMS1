import { RegistrationRepository } from "../../models/registration_repository.js";
import { mapError } from "../../api/registration_error_mapper.js";
import { hashToken } from "../security/verification_token_service.js";
import { isPendingExpired, isTokenExpired } from "./registration_expiry_service.js";

export function verifyRegistration(deps, request) {
  const now = deps.nowProvider ? deps.nowProvider() : new Date();
  const token = request.query?.token;
  if (!token || typeof token !== "string") {
    return { status: 400, body: mapError("TOKEN_MISSING", "Verification token is required.") };
  }
  const tokenHash = hashToken(token);
  const tokenRecord = deps.repository.getTokenByHash(tokenHash);
  if (!tokenRecord) {
    return { status: 410, body: mapError("TOKEN_INVALID", "Verification token is invalid.") };
  }
  if (tokenRecord.usedAt || tokenRecord.invalidatedAt) {
    return { status: 410, body: mapError("TOKEN_ALREADY_USED", "Verification token is no longer active.") };
  }
  if (isTokenExpired(tokenRecord, now)) {
    return { status: 410, body: mapError("TOKEN_EXPIRED", "Verification token has expired.") };
  }

  const pending = [...deps.repository.pendingByEmail.values()].find(
    (entry) => entry.id === tokenRecord.pendingRegistrationId
  );
  if (!pending) {
    return { status: 410, body: mapError("REGISTRATION_NOT_FOUND", "Pending registration not found.") };
  }
  if (isPendingExpired(pending, now)) {
    deps.repository.markPendingExpired(pending.email);
    return { status: 410, body: mapError("REGISTRATION_ATTEMPT_EXPIRED", "Pending registration has expired.") };
  }

  deps.repository.markTokenUsed(tokenHash, now);
  deps.repository.markPendingVerified(pending.email, now);
  if (!deps.repository.findActiveUserByEmail(pending.email)) {
    deps.repository.createActiveUser({
      email: pending.email,
      passwordHash: pending.passwordHash,
      now
    });
  }
  deps.auditLog?.record("registration_verified", { email: pending.email });

  return {
    status: 200,
    body: {
      status: "VERIFIED",
      redirect: "/login"
    }
  };
}
