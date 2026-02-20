import crypto from "node:crypto";

export class SessionService {
  constructor() {
    this.sessions = new Map();
  }

  createSession(email, now) {
    const sessionId = crypto.randomUUID();
    this.sessions.set(sessionId, { email, createdAt: now.toISOString() });
    return sessionId;
  }

  isSessionActive(sessionId) {
    return this.sessions.has(sessionId);
  }

  invalidateSession(sessionId) {
    return this.sessions.delete(sessionId);
  }
}
