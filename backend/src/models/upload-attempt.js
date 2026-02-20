import crypto from "node:crypto";

export class UploadAttemptRepository {
  constructor() {
    this.attempts = [];
  }

  add({ submissionId, outcome, mode, now }) {
    const entry = {
      id: crypto.randomUUID(),
      submissionId,
      outcome,
      mode,
      at: now.toISOString()
    };
    this.attempts.push(entry);
    return entry;
  }
}
