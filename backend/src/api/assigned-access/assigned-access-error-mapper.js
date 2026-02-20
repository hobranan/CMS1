export function mapForbiddenAccess() {
  return {
    status: 403,
    body: {
      code: "ASSIGNMENT_FORBIDDEN",
      message: "Access denied for non-assigned paper."
    }
  };
}

