export function requiredFieldErrors(errors) {
  return {
    status: 400,
    body: {
      code: "REQUIRED_FIELDS_MISSING",
      message: "Current password, new password, and confirmation are required.",
      errors
    }
  };
}

export function mismatchError() {
  return {
    status: 400,
    body: {
      code: "CONFIRMATION_MISMATCH",
      message: "New password confirmation does not match."
    }
  };
}

export function incorrectCurrentPassword() {
  return {
    status: 400,
    body: {
      code: "INCORRECT_CURRENT_PASSWORD",
      message: "Current password is incorrect."
    }
  };
}

export function policyViolation(errors) {
  return {
    status: 400,
    body: {
      code: "PASSWORD_POLICY_VIOLATION",
      message: "New password does not meet policy requirements.",
      errors
    }
  };
}

export function systemFailure() {
  return {
    status: 503,
    body: {
      code: "SYSTEM_TEMPORARILY_UNAVAILABLE",
      message: "Temporary system problem. Please retry later."
    }
  };
}
