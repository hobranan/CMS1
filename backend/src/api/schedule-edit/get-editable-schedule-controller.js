import { scheduleEditRoleGuard } from "../middleware/schedule-edit-role-guard.js";
import { mapScheduleEditResponse } from "./schedule-edit-response-mapper.js";

export function createGetEditableScheduleController(deps) {
  return {
    get: (request) => {
      const guard = scheduleEditRoleGuard(request);
      if (!guard.ok) return { status: guard.status, body: guard.body };

      const conferenceId = request.params?.conferenceId;
      const schedule = deps.scheduleDraftRepository.getPublished(conferenceId);
      if (!schedule) {
        return { status: 404, body: { code: "SCHEDULE_NOT_FOUND", message: "Editable schedule not found." } };
      }

      const version = (deps.scheduleEditVersions.get(conferenceId) ?? 1);
      return { status: 200, body: mapScheduleEditResponse(schedule, version) };
    }
  };
}
