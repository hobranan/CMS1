import { scheduleRoleGuard } from "../middleware/schedule-role-guard.js";
import { mapConflictHighlight } from "./conflict-highlight-mapper.js";

export function createPostPublishScheduleController(deps) {
  return {
    post: (request) => {
      const guard = scheduleRoleGuard(request);
      if (!guard.ok) return { status: guard.status, body: guard.body };

      if (request.body?.confirm !== true) {
        return { status: 200, body: { status: "cancelled", message: "Publish cancelled." } };
      }

      const conferenceId = request.params?.conferenceId;
      const draftId = request.params?.draftId;
      const draft = deps.scheduleDraftRepository.getDraft(draftId);
      if (!draft || draft.conferenceId !== conferenceId) {
        return { status: 404, body: { code: "DRAFT_NOT_FOUND", message: "Schedule draft not found." } };
      }

      const highlight = mapConflictHighlight(draft);
      if (highlight.blockingCount > 0) {
        return { status: 400, body: { code: "BLOCKING_CONFLICTS", message: "Resolve blocking conflicts before publish.", ...highlight } };
      }

      const published = deps.scheduleDraftRepository.publishDraft({ conferenceId, draftId });
      return {
        status: 200,
        body: { draftId: published.draftId, status: published.status }
      };
    }
  };
}
