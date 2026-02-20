export function mapScheduleError(result) {
  if (result?.status) return result;
  return { status: 500, body: { code: "SCHEDULE_ERROR", message: "Schedule operation failed." } };
}
