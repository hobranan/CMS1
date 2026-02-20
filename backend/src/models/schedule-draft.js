import crypto from "node:crypto";

export class ScheduleDraftRepository {
  constructor() {
    this.conferences = new Map();
    this.drafts = new Map();
    this.publishedByConference = new Map();
    this.failNextSave = false;
    this.failNextEditSave = false;
    this.failNextPublicScheduleRead = false;
    this.failNextPublicEntryRead = false;
    this.failNextPublicPdfRead = false;
  }

  seedConference({
    conferenceId,
    acceptedPapers = [],
    rooms = [],
    parameters = {},
    editorIds = [],
    editLocked = false,
    lockReason = null
  }) {
    this.conferences.set(conferenceId, {
      conferenceId,
      acceptedPapers,
      rooms,
      parameters,
      editorIds,
      editLocked,
      lockReason
    });
  }

  getConference(conferenceId) {
    return this.conferences.get(conferenceId) ?? null;
  }

  createDraft({ conferenceId, grid, placements, conflicts }) {
    if (this.failNextSave) {
      this.failNextSave = false;
      const err = new Error("SCHEDULE_SAVE_FAILURE");
      err.code = "SCHEDULE_SAVE_FAILURE";
      throw err;
    }
    const draftId = crypto.randomUUID();
    const draft = {
      draftId,
      conferenceId,
      status: "draft",
      grid,
      placements,
      conflicts,
      createdAt: new Date().toISOString()
    };
    this.drafts.set(draftId, draft);
    return draft;
  }

  getDraft(draftId) {
    return this.drafts.get(draftId) ?? null;
  }

  publishDraft({ conferenceId, draftId }) {
    const draft = this.getDraft(draftId);
    if (!draft || draft.conferenceId !== conferenceId) return null;
    draft.status = "published";
    this.publishedByConference.set(conferenceId, draft);
    return draft;
  }

  getPublished(conferenceId) {
    return this.publishedByConference.get(conferenceId) ?? null;
  }

  failNextDraftSave() {
    this.failNextSave = true;
  }

  failNextScheduleEditSave() {
    this.failNextEditSave = true;
  }

  failNextPublicSchedule() {
    this.failNextPublicScheduleRead = true;
  }

  failNextPublicEntry() {
    this.failNextPublicEntryRead = true;
  }

  failNextPublicPdf() {
    this.failNextPublicPdfRead = true;
  }
}
