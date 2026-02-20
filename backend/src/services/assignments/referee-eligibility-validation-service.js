export function validateRefereeEligibility(assignmentRepository, refereeIds) {
  const errors = [];
  for (const refereeId of refereeIds) {
    const referee = assignmentRepository.getReferee(refereeId);
    if (!referee) {
      errors.push({
        code: "REFEREE_NOT_FOUND",
        field: "referee_ids",
        message: `Referee ${refereeId} does not exist.`
      });
      continue;
    }
    if (!referee.eligible) {
      errors.push({
        code: "REFEREE_INELIGIBLE",
        field: "referee_ids",
        message: `Referee ${refereeId} is not eligible.`
      });
    }
    if (referee.currentLoad + 1 > referee.maxLoad) {
      errors.push({
        code: "WORKLOAD_LIMIT_EXCEEDED",
        field: "referee_ids",
        message: `Referee ${refereeId} exceeds workload limit.`
      });
    }
  }
  return {
    valid: errors.length === 0,
    errors
  };
}

