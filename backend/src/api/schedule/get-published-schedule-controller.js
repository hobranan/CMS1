import { scheduleRoleGuard } from "../middleware/schedule-role-guard.js";

export function createGetPublishedScheduleController(deps) {
  return {
    get: (request) => {
      const guard = scheduleRoleGuard(request);
      if (!guard.ok) return { status: guard.status, body: guard.body };

      const conferenceId = request.params?.conferenceId;
      const published = deps.scheduleDraftRepository.getPublished(conferenceId);
      if (!published) {
        return { status: 404, body: { code: "PUBLISHED_SCHEDULE_NOT_AVAILABLE", message: "Published schedule not available." } };
      }
      return {
        status: 200,
        body: {
          draftId: published.draftId,
          status: published.status,
          grid: published.grid,
          placements: published.placements,
          conflicts: published.conflicts
        }
      };
    }
  };
}
