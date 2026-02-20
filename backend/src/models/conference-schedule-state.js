export function toConferenceScheduleState(schedule, version = 1) {
  return {
    conferenceId: schedule.conferenceId,
    status: schedule.status,
    version,
    lastEditedAt: schedule.lastEditedAt ?? null
  };
}
