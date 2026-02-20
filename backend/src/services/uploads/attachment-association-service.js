export class AttachmentAssociationService {
  constructor() {
    this.failNextAssociation = false;
  }

  failNext() {
    this.failNextAssociation = true;
  }

  associate({ paperSubmissionRepository, fileAttachmentRecordRepository, submissionId, file, now }) {
    if (this.failNextAssociation) {
      this.failNextAssociation = false;
      const err = new Error("Association failed");
      err.code = "ASSOCIATION_FAILURE";
      throw err;
    }
    const attachedSubmission = paperSubmissionRepository.attachManuscript(submissionId, file, now);
    if (!attachedSubmission) {
      const err = new Error("Submission not found");
      err.code = "SUBMISSION_NOT_FOUND";
      throw err;
    }
    return fileAttachmentRecordRepository.setAttached(submissionId, file, now);
  }
}
