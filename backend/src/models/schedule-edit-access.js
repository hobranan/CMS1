export function canEditSchedule({ userRole, isLocked }) {
  if (!["admin", "editor"].includes(userRole)) return { ok: false, code: "FORBIDDEN", status: 403 };
  if (isLocked) return { ok: false, code: "SCHEDULE_LOCKED", status: 423 };
  return { ok: true };
}
