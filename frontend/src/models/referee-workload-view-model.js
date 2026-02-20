export function toRefereeWorkloadViewModel(response) {
  if (response.status !== 200) {
    return null;
  }
  return {
    refereeId: response.body.referee_id,
    currentWorkload: response.body.current_workload,
    applicableLimit: response.body.applicable_limit
  };
}

