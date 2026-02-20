export function asPublicScheduleAvailability(schedule) {
  return { published: Boolean(schedule), unavailableReason: schedule ? null : "not_published" };
}
