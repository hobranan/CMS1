export function scheduleRoleGuard(request) {
  if (!request.user?.email) {
    return { ok: false, status: 401, body: { code: "AUTH_REQUIRED", message: "Authentication required." } };
  }
  if (!["admin", "editor"].includes(request.user.role)) {
    return { ok: false, status: 403, body: { code: "FORBIDDEN", message: "Schedule access denied." } };
  }
  return { ok: true };
}
