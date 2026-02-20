import { scheduleRoleGuard } from "../middleware/schedule-role-guard.js";
import { loadScheduleInputs } from "../../services/schedule/schedule-input-loader.js";
import { validateGenerationPrereqs } from "../../services/schedule/generation-prereq-validator.js";
import { generateSchedulePipeline } from "../../services/schedule/generate-schedule-pipeline.js";
import { persistScheduleDraft } from "../../services/schedule/schedule-draft-persistence-service.js";

export function createPostGenerateScheduleController(deps) {
  return {
    post: (request) => {
      const guard = scheduleRoleGuard(request);
      if (!guard.ok) return { status: guard.status, body: guard.body };

      const conferenceId = request.params?.conferenceId;
      const inputs = loadScheduleInputs(deps.scheduleDraftRepository, conferenceId);
      const prereq = validateGenerationPrereqs(inputs);
      if (!prereq.ok) {
        deps.scheduleGenerationObservabilityService?.record("schedule_generation_blocked", { conferenceId, code: prereq.body.code });
        return prereq;
      }

      const availableRooms = deps.roomAvailabilityService ? deps.roomAvailabilityService(inputs.rooms) : inputs.rooms;
      const generated = generateSchedulePipeline({
        acceptedPapers: inputs.acceptedPapers,
        rooms: availableRooms,
        parameters: inputs.parameters,
        seed: request.body?.seed
      });

      const saved = persistScheduleDraft(deps.scheduleDraftRepository, {
        conferenceId,
        grid: generated.grid,
        placements: generated.placements,
        conflicts: generated.conflicts
      });
      if (!saved.ok) {
        deps.scheduleGenerationObservabilityService?.record("schedule_generation_failed", { conferenceId, code: saved.body.code });
        return saved;
      }
      deps.scheduleGenerationObservabilityService?.record("schedule_generated", { conferenceId, draftId: saved.draft.draftId });
      return {
        status: 200,
        body: {
          draftId: saved.draft.draftId,
          status: saved.draft.status,
          grid: saved.draft.grid,
          placements: saved.draft.placements,
          conflicts: saved.draft.conflicts
        }
      };
    }
  };
}
