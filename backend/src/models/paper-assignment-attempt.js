import crypto from "node:crypto";

export class PaperAssignmentAttemptRepository {
  constructor() {
    this.attempts = [];
  }

  add({ paperId, refereeId, outcome, now }) {
    this.attempts.push({
      id: crypto.randomUUID(),
      paperId,
      refereeId,
      outcome,
      at: now.toISOString()
    });
  }
}

