export function missingFields(errors) {
  return {
    status: 400,
    body: {
      code: "REQUIRED_FIELDS_MISSING",
      message: "Email and password are required.",
      errors
    }
  };
}

export function invalidCredentials() {
  return {
    status: 401,
    body: {
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password."
    }
  };
}

export function lockout(lockoutExpiresAt) {
  return {
    status: 423,
    body: {
      code: "ACCOUNT_LOCKED",
      message: "Account is temporarily locked.",
      retry_at: lockoutExpiresAt
    }
  };
}

export function credentialStoreUnavailable() {
  return {
    status: 503,
    body: {
      code: "SYSTEM_TEMPORARILY_UNAVAILABLE",
      message: "Temporary system problem. Please retry later."
    }
  };
}
