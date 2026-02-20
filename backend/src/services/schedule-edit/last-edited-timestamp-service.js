export function updateLastEditedTimestamp(schedule) {
  const now = Date.now();
  const previous = schedule.lastEditedAt ? Date.parse(schedule.lastEditedAt) : 0;
  const next = Math.max(now, previous + 1);
  schedule.lastEditedAt = new Date(next).toISOString();
  return schedule.lastEditedAt;
}
