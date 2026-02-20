export class UploadTransferService {
  constructor() {
    this.forceInterruption = false;
    this.forceStorageFailure = false;
  }

  failNextWithInterruption() {
    this.forceInterruption = true;
  }

  failNextWithStorageFailure() {
    this.forceStorageFailure = true;
  }

  transfer({ submissionId, file, mode, resumeOffsetBytes, onCheckpoint }) {
    if (this.forceInterruption) {
      this.forceInterruption = false;
      const offset = Math.max(1, Math.floor(Number(file.sizeBytes ?? 0) / 2));
      onCheckpoint?.(offset);
      const err = new Error("Upload interrupted");
      err.code = "UPLOAD_INTERRUPTED";
      err.offsetBytes = offset;
      throw err;
    }
    if (this.forceStorageFailure) {
      this.forceStorageFailure = false;
      const err = new Error("Storage unavailable");
      err.code = "STORAGE_FAILURE";
      throw err;
    }
    const offset = Number(file.sizeBytes ?? 0);
    onCheckpoint?.(offset);
    return {
      submissionId,
      storedPath: `submissions/${submissionId}/${file.fileName}`,
      mode,
      uploadedBytes: offset,
      resumeOffsetBytes
    };
  }
}
