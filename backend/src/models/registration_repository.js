import crypto from "node:crypto";

function nowIso(date) {
  return date.toISOString();
}

export class RegistrationRepository {
  constructor() {
    this.usersByEmail = new Map();
    this.pendingByEmail = new Map();
    this.tokensByHash = new Map();
    this.locks = new Set();
  }

  static normalizeEmail(email) {
    return String(email ?? "").trim().toLowerCase();
  }

  createId() {
    return crypto.randomUUID();
  }

  acquireLock(key) {
    if (this.locks.has(key)) {
      return false;
    }
    this.locks.add(key);
    return true;
  }

  releaseLock(key) {
    this.locks.delete(key);
  }

  findActiveUserByEmail(email) {
    return this.usersByEmail.get(RegistrationRepository.normalizeEmail(email)) ?? null;
  }

  findPendingByEmail(email) {
    return this.pendingByEmail.get(RegistrationRepository.normalizeEmail(email)) ?? null;
  }

  createPendingRegistration({ email, passwordHash, now, expiresAt }) {
    const normalizedEmail = RegistrationRepository.normalizeEmail(email);
    const pending = {
      id: this.createId(),
      email: normalizedEmail,
      passwordHash,
      status: "PENDING_VERIFICATION",
      submittedAt: nowIso(now),
      registrationExpiresAt: nowIso(expiresAt),
      verifiedAt: null,
      resendAttempts: []
    };
    this.pendingByEmail.set(normalizedEmail, pending);
    return pending;
  }

  markPendingVerified(email, now) {
    const pending = this.findPendingByEmail(email);
    if (!pending) return null;
    pending.status = "VERIFIED";
    pending.verifiedAt = nowIso(now);
    return pending;
  }

  markPendingExpired(email) {
    const pending = this.findPendingByEmail(email);
    if (!pending) return null;
    pending.status = "EXPIRED";
    return pending;
  }

  createActiveUser({ email, passwordHash, now }) {
    const normalizedEmail = RegistrationRepository.normalizeEmail(email);
    const user = {
      id: this.createId(),
      email: normalizedEmail,
      passwordHash,
      status: "ACTIVE",
      createdAt: nowIso(now),
      updatedAt: nowIso(now)
    };
    this.usersByEmail.set(normalizedEmail, user);
    return user;
  }

  saveVerificationToken({ pendingRegistrationId, tokenHash, issuedAt, expiresAt }) {
    const tokenRecord = {
      id: this.createId(),
      pendingRegistrationId,
      tokenHash,
      issuedAt: nowIso(issuedAt),
      expiresAt: nowIso(expiresAt),
      usedAt: null,
      invalidatedAt: null
    };
    this.tokensByHash.set(tokenHash, tokenRecord);
    return tokenRecord;
  }

  getTokenByHash(tokenHash) {
    return this.tokensByHash.get(tokenHash) ?? null;
  }

  invalidateActiveTokens(pendingRegistrationId, now) {
    for (const token of this.tokensByHash.values()) {
      if (token.pendingRegistrationId !== pendingRegistrationId) continue;
      if (token.usedAt || token.invalidatedAt) continue;
      token.invalidatedAt = nowIso(now);
    }
  }

  markTokenUsed(tokenHash, now) {
    const token = this.getTokenByHash(tokenHash);
    if (!token) return null;
    token.usedAt = nowIso(now);
    return token;
  }
}
