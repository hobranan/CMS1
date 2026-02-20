export function requireAuthenticatedUser(request) {
  if (!request.user || !request.user.id) {
    return {
      allowed: false,
      response: {
        status: 401,
        body: {
          code: "AUTH_REQUIRED",
          message: "Authentication is required."
        }
      }
    };
  }
  return { allowed: true };
}
