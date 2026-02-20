export function publicScheduleErrorMessage(response) {
  if (response.status === 404) return "Public schedule not available.";
  if (response.status === 500) return "Unable to load public schedule.";
  return "";
}
