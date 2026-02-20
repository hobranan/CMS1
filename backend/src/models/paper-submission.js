import crypto from "node:crypto";

export class PaperSubmissionRepository {
  constructor() {
    this.submissions = new Map();
  }

  createDraft({ authorEmail, metadata, manuscriptFile, now }) {
    const id = crypto.randomUUID();
    const record = {
      id,
      authorEmail,
      metadata,
      manuscriptFile,
      status: "DRAFT",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
    this.submissions.set(id, record);
    return record;
  }

  finalize(id, now) {
    const record = this.submissions.get(id);
    if (!record) return null;
    record.status = "FINALIZED";
    record.updatedAt = now.toISOString();
    return record;
  }

  setInterrupted(id, now) {
    const record = this.submissions.get(id);
    if (!record) return null;
    record.status = "UPLOAD_INTERRUPTED";
    record.updatedAt = now.toISOString();
    return record;
  }

  listByAuthorEmail(authorEmail) {
    return [...this.submissions.values()].filter((r) => r.authorEmail === authorEmail && r.status === "FINALIZED");
  }

  getById(id) {
    return this.submissions.get(id) ?? null;
  }

  attachManuscript(id, file, now) {
    const record = this.submissions.get(id);
    if (!record) return null;
    record.manuscriptFile = file;
    record.attached = true;
    record.updatedAt = now.toISOString();
    return record;
  }
}
