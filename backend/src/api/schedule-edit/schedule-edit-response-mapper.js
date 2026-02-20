export function mapScheduleEditResponse(schedule, version) {
  return {
    conferenceId: schedule.conferenceId,
    status: schedule.status,
    version,
    lastEditedAt: schedule.lastEditedAt ?? null,
    grid: schedule.grid,
    placements: schedule.placements,
    conflicts: schedule.conflicts
  };
}
