import crypto from "node:crypto";

export class FormSubmissionRepository {
  constructor() {
    this.submissions = [];
    this.records = new Map();
  }

  recordValidationResult(result) {
    this.submissions.push({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...result
    });
  }

  getRecord(recordId) {
    return this.records.get(recordId) ?? null;
  }

  saveRecord(recordId, payload, updatedAt) {
    this.records.set(recordId, {
      recordId,
      ...payload,
      updatedAt
    });
    return this.records.get(recordId);
  }
}
