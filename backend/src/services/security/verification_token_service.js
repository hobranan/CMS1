import crypto from "node:crypto";

export function generateRawToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export function hashToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export function issueVerificationToken({ repository, pendingRegistration, now, config }) {
  const rawToken = generateRawToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(now.getTime() + config.verificationTokenTtlHours * 60 * 60 * 1000);

  repository.invalidateActiveTokens(pendingRegistration.id, now);
  repository.saveVerificationToken({
    pendingRegistrationId: pendingRegistration.id,
    tokenHash,
    issuedAt: now,
    expiresAt
  });

  return { rawToken, tokenHash, expiresAt };
}
