import { scheduleEditRoleGuard } from "../middleware/schedule-edit-role-guard.js";
import { enforcePolicyLock } from "../../services/schedule-edit/policy-lock-service.js";
import { mapScheduleLockFeedback } from "./schedule-lock-feedback-mapper.js";
import { checkScheduleVersion } from "../../services/schedule-edit/schedule-version-check-service.js";
import { validateScheduleEdits } from "../../services/schedule-edit/schedule-edit-validation-service.js";
import { persistScheduleEdit } from "../../services/schedule-edit/schedule-edit-persistence-service.js";
import { updateLastEditedTimestamp } from "../../services/schedule-edit/last-edited-timestamp-service.js";
import { mapScheduleEditError } from "./schedule-edit-error-mapper.js";
import { mapScheduleEditResponse } from "./schedule-edit-response-mapper.js";

export function createPostSaveScheduleController(deps) {
  return {
    post: (request) => {
      const guard = scheduleEditRoleGuard(request);
      if (!guard.ok) return { status: guard.status, body: guard.body };

      const conferenceId = request.params?.conferenceId;
      const conference = deps.scheduleDraftRepository.getConference(conferenceId);
      const lockInfo = enforcePolicyLock(conference);
      if (lockInfo.locked) return mapScheduleLockFeedback(lockInfo);

      const currentVersion = deps.scheduleEditVersions.get(conferenceId) ?? 1;
      const expectedVersion = request.body?.expectedVersion;
      const versionCheck = checkScheduleVersion({ expectedVersion, currentVersion });
      if (!versionCheck.ok) return { status: versionCheck.status, body: { code: versionCheck.code, message: versionCheck.message } };

      const draft = deps.scheduleDraftRepository.getPublished(conferenceId);
      if (!draft) return { status: 404, body: { code: "SCHEDULE_NOT_FOUND", message: "Schedule not found." } };

      const validation = validateScheduleEdits({ draft, editPayload: request.body?.edits });
      if (!validation.valid) {
        const primary = validation.issues[0];
        return { status: 400, body: { code: primary.code, message: primary.message, issues: validation.issues } };
      }

      const saved = persistScheduleEdit(deps.scheduleDraftRepository, { conferenceId, editPayload: request.body.edits });
      if (saved.status !== 200) return mapScheduleEditError(saved);

      updateLastEditedTimestamp(saved.schedule);
      const nextVersion = currentVersion + 1;
      deps.scheduleEditVersions.set(conferenceId, nextVersion);
      deps.scheduleEditObservabilityService?.record("schedule_edit_saved", { conferenceId, version: nextVersion });
      return { status: 200, body: mapScheduleEditResponse(saved.schedule, nextVersion) };
    }
  };
}
