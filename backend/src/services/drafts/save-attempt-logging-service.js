export function logSaveOutcome(saveAttemptRepository, draftId, outcome, now) {
  saveAttemptRepository.add({ draftId, outcome, now });
}
