export class SubmissionPersistenceService {
  constructor(paperSubmissionRepository) {
    this.paperSubmissionRepository = paperSubmissionRepository;
    this.failNext = false;
  }

  forceNextFailure() {
    this.failNext = true;
  }

  saveFinalizedSubmission({ authorEmail, metadata, manuscriptFile, now }) {
    if (this.failNext) {
      this.failNext = false;
      throw new Error("Storage failure");
    }
    const draft = this.paperSubmissionRepository.createDraft({
      authorEmail,
      metadata,
      manuscriptFile,
      now
    });
    return this.paperSubmissionRepository.finalize(draft.id, now);
  }
}
