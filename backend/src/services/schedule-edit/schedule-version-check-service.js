export function checkScheduleVersion({ expectedVersion, currentVersion }) {
  if (expectedVersion !== currentVersion) {
    return { ok: false, status: 409, code: "STALE_VERSION", message: "Schedule has newer edits. Reload before saving." };
  }
  return { ok: true };
}
