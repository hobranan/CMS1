export function resolveWorkloadLimit(workloadLimitRuleRepository, { trackId, role }) {
  return workloadLimitRuleRepository.resolveRule({ trackId, role });
}

