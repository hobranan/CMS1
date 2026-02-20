import { scheduleEditRoleGuard } from "../middleware/schedule-edit-role-guard.js";

export function createPostCancelScheduleEditController() {
  return {
    post: (request) => {
      const guard = scheduleEditRoleGuard(request);
      if (!guard.ok) return { status: guard.status, body: guard.body };
      return { status: 200, body: { status: "cancelled", message: "Unsaved schedule edits were discarded." } };
    }
  };
}
