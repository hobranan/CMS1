export function createWorkloadSnapshot({ refereeId, currentWorkload, limit, ruleId, ruleVersion }) {
  return {
    refereeId,
    currentWorkload,
    limit,
    ruleId,
    ruleVersion
  };
}

