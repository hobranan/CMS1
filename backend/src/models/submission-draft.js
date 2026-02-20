import crypto from "node:crypto";

export class SubmissionDraftRepository {
  constructor() {
    this.drafts = new Map();
  }

  createDraft({ authorEmail, now }) {
    const id = crypto.randomUUID();
    const draft = {
      id,
      authorEmail,
      status: "DRAFT",
      editableState: {},
      stateHash: "",
      version: 0,
      lastSavedAt: null,
      updatedAt: now.toISOString()
    };
    this.drafts.set(id, draft);
    return draft;
  }

  get(draftId) {
    return this.drafts.get(draftId) ?? null;
  }

  update(draftId, updater) {
    const draft = this.get(draftId);
    if (!draft) return null;
    updater(draft);
    return draft;
  }
}
