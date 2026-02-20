export function mapSaveSystemFailure(code) {
  if (code === "NETWORK_FAILURE") {
    return {
      status: 503,
      body: {
        code: "NETWORK_FAILURE",
        message: "Connectivity problem while saving draft. Retry."
      }
    };
  }
  return {
    status: 503,
    body: {
      code: "SYSTEM_FAILURE",
      message: "Temporary system problem while saving draft. Retry later."
    }
  };
}
