const RESUME_WINDOW_MS = 30 * 60 * 1000;

export function resolveRetryMode(progressRepo, submissionId, fileFingerprint, now) {
  const checkpoint = progressRepo.getCheckpoint(submissionId, fileFingerprint);
  if (!checkpoint) {
    return { mode: "RESTART", resumeOffsetBytes: 0 };
  }
  const age = now.getTime() - new Date(checkpoint.updatedAt).getTime();
  if (age <= RESUME_WINDOW_MS) {
    return { mode: "RESUME", resumeOffsetBytes: checkpoint.offsetBytes };
  }
  progressRepo.clearCheckpoint(submissionId, fileFingerprint);
  return { mode: "RESTART", resumeOffsetBytes: 0 };
}

export function persistCheckpoint(progressRepo, submissionId, fileFingerprint, offsetBytes, now) {
  return progressRepo.saveCheckpoint({
    submissionId,
    fileFingerprint,
    offsetBytes,
    now
  });
}
