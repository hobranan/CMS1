export function recordAssignmentAttempt(attemptRepository, { paperId, refereeId, outcome, now }) {
  attemptRepository.add({ paperId, refereeId, outcome, now });
}

