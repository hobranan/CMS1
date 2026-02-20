export class AtomicFormPersistenceService {
  constructor(formSubmissionRepository) {
    this.formSubmissionRepository = formSubmissionRepository;
    this.failNext = false;
  }

  forceNextFailure() {
    this.failNext = true;
  }

  persistAtomically({ recordId, payload, now }) {
    if (this.failNext) {
      this.failNext = false;
      throw new Error("Forced persistence failure");
    }
    return this.formSubmissionRepository.saveRecord(recordId, payload, now.toISOString());
  }
}
