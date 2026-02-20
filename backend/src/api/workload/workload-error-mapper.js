export function mapWorkloadLimitError(code) {
  if (code === "WORKLOAD_REFRESH_REQUIRED") {
    return {
      status: 409,
      body: {
        code,
        message: "Workload/limit changed since selection. Refresh and retry."
      }
    };
  }
  return {
    status: 400,
    body: {
      code: "WORKLOAD_LIMIT_REACHED",
      message: "Referee is at or above workload limit."
    }
  };
}

