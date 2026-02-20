export class DraftPersistenceService {
  constructor(submissionDraftRepository) {
    this.submissionDraftRepository = submissionDraftRepository;
    this.failNext = null;
  }

  failNextWith(code) {
    this.failNext = code;
  }

  persistDraftState({ draftId, editableState, stateHash, now }) {
    if (this.failNext) {
      const code = this.failNext;
      this.failNext = null;
      const err = new Error(code);
      err.code = code;
      throw err;
    }
    return this.submissionDraftRepository.update(draftId, (draft) => {
      draft.editableState = { ...editableState };
      draft.stateHash = stateHash;
      draft.version += 1;
      draft.lastSavedAt = now.toISOString();
      draft.updatedAt = now.toISOString();
    });
  }
}
