export function allowPublishedScheduleEdit(schedule) {
  return schedule?.status === "published";
}
