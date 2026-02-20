export class UploadProgressStateRepository {
  constructor() {
    this.states = new Map();
  }

  key(submissionId, fileFingerprint) {
    return `${submissionId}:${fileFingerprint}`;
  }

  saveCheckpoint({ submissionId, fileFingerprint, offsetBytes, now }) {
    const value = {
      submissionId,
      fileFingerprint,
      offsetBytes,
      updatedAt: now.toISOString()
    };
    this.states.set(this.key(submissionId, fileFingerprint), value);
    return value;
  }

  getCheckpoint(submissionId, fileFingerprint) {
    return this.states.get(this.key(submissionId, fileFingerprint)) ?? null;
  }

  clearCheckpoint(submissionId, fileFingerprint) {
    this.states.delete(this.key(submissionId, fileFingerprint));
  }
}
