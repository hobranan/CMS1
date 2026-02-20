import { asPublishedSchedule, asScheduleEntry } from "../../models/public-schedule-models.js";

export function retrievePublicSchedule(repository, conferenceId) {
  try {
    const schedule = repository.getPublished(conferenceId);
    if (!schedule) {
      return { status: 404, body: { code: "SCHEDULE_NOT_PUBLISHED", message: "Public schedule is not available yet." } };
    }

    if (repository.failNextPublicScheduleRead) {
      repository.failNextPublicScheduleRead = false;
      throw new Error("PUBLIC_SCHEDULE_RETRIEVAL_FAILURE");
    }

    const entries = schedule.entries ?? [];
    const grouped = {};
    for (const entry of entries) {
      grouped[entry.day] = grouped[entry.day] ?? [];
      grouped[entry.day].push(asScheduleEntry(entry));
    }

    return {
      status: 200,
      body: {
        schedule: asPublishedSchedule(schedule),
        days: Object.keys(grouped).map((day) => ({ day, entries: grouped[day] }))
      }
    };
  } catch {
    return { status: 500, body: { code: "PUBLIC_SCHEDULE_RETRIEVAL_FAILURE", message: "Public schedule could not be loaded." } };
  }
}
