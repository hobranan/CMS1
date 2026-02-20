export class FileAttachmentRecordRepository {
  constructor() {
    this.recordsBySubmissionId = new Map();
  }

  get(submissionId) {
    return this.recordsBySubmissionId.get(submissionId) ?? { attached: false };
  }

  setAttached(submissionId, file, now) {
    const record = {
      submissionId,
      attached: true,
      fileName: file.fileName,
      contentType: file.contentType,
      sizeBytes: file.sizeBytes,
      attachedAt: now.toISOString()
    };
    this.recordsBySubmissionId.set(submissionId, record);
    return record;
  }

  setUnattached(submissionId) {
    this.recordsBySubmissionId.set(submissionId, { submissionId, attached: false });
  }
}
