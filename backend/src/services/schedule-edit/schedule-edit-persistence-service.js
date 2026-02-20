import { asScheduleSaveOutcome } from "../../models/schedule-save-outcome.js";

export function persistScheduleEdit(repository, { conferenceId, editPayload }) {
  try {
    const published = repository.getPublished(conferenceId);
    if (!published) {
      return asScheduleSaveOutcome({ status: 404, code: "SCHEDULE_NOT_FOUND", message: "Schedule not found." });
    }
    if (repository.failNextEditSave) {
      repository.failNextEditSave = false;
      return asScheduleSaveOutcome({ status: 500, code: "DB_SAVE_FAILURE", message: "Could not save schedule edits." });
    }
    published.grid = editPayload.grid ?? published.grid;
    published.placements = editPayload.placements ?? published.placements;
    published.conflicts = editPayload.conflicts ?? published.conflicts;
    published.status = "published";
    return asScheduleSaveOutcome({ status: 200, schedule: published });
  } catch {
    return asScheduleSaveOutcome({ status: 500, code: "DB_SAVE_FAILURE", message: "Could not save schedule edits." });
  }
}
