import { projectScheduleDetail } from "../../models/schedule-detail-projection.js";

export function retrievePublicEntryDetail(repository, conferenceId, entryId, policy) {
  const schedule = repository.getPublished(conferenceId);
  if (!schedule) {
    return { status: 404, body: { code: "SCHEDULE_NOT_PUBLISHED", message: "Public schedule is not available yet." } };
  }

  if (repository.failNextPublicEntryRead) {
    repository.failNextPublicEntryRead = false;
    return { status: 500, body: { code: "PUBLIC_ENTRY_RETRIEVAL_FAILURE", message: "Entry details could not be loaded." } };
  }

  const entry = (schedule.entries ?? []).find((e) => e.entryId === entryId);
  if (!entry) {
    return { status: 404, body: { code: "ENTRY_NOT_FOUND", message: "Schedule entry not found." } };
  }

  return { status: 200, body: projectScheduleDetail(entry, policy) };
}
