export function mapWorkloadFailure(code) {
  if (code === "WORKLOAD_STORAGE_FAILURE") {
    return {
      status: 503,
      body: {
        code,
        message: "Unable to store assignment. Retry later."
      }
    };
  }
  return {
    status: 503,
    body: {
      code: "WORKLOAD_RETRIEVAL_FAILURE",
      message: "Unable to read workload/limit data. Retry later."
    }
  };
}

