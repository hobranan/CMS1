export function detectDecisionConflict(repository, paperId) {
  const existing = repository.getDecision(paperId);
  if (existing) {
    return {
      conflict: true,
      status: 409,
      code: "ALREADY_DECIDED",
      message: "Paper already has a final decision."
    };
  }
  return { conflict: false };
}
