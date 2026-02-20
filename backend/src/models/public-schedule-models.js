export function asPublishedSchedule(schedule) {
  return {
    conferenceId: schedule.conferenceId,
    status: schedule.status,
    entries: schedule.entries ?? []
  };
}

export function asScheduleEntry(entry) {
  return {
    entryId: entry.entryId,
    day: entry.day,
    session: entry.session,
    title: entry.title,
    startTime: entry.startTime,
    location: entry.location
  };
}
