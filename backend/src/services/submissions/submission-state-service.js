export function markUploadInterrupted(paperSubmissionRepository, submissionId, now) {
  return paperSubmissionRepository.setInterrupted(submissionId, now);
}
