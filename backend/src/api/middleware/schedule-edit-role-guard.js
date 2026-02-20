import { scheduleRoleGuard } from "../middleware/schedule-role-guard.js";

export function scheduleEditRoleGuard(request) {
  return scheduleRoleGuard(request);
}
