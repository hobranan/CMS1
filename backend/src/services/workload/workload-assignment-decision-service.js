export function decideAssignment({
  currentWorkload,
  limit,
  selectionSnapshot
}) {
  if (
    selectionSnapshot
    && (
      selectionSnapshot.current_workload !== currentWorkload
      || selectionSnapshot.limit !== limit
    )
  ) {
    return {
      allowed: false,
      status: 409,
      code: "WORKLOAD_REFRESH_REQUIRED",
      message: "Workload or limit changed. Refresh and retry."
    };
  }

  if (currentWorkload >= limit) {
    return {
      allowed: false,
      status: 400,
      code: "WORKLOAD_LIMIT_REACHED",
      message: "Referee has reached configured workload limit."
    };
  }

  return {
    allowed: true
  };
}

