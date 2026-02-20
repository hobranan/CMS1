import crypto from "node:crypto";

export class SaveAttemptRepository {
  constructor() {
    this.attempts = [];
  }

  add({ draftId, outcome, now }) {
    const attempt = {
      id: crypto.randomUUID(),
      draftId,
      outcome,
      at: now.toISOString()
    };
    this.attempts.push(attempt);
    return attempt;
  }
}
