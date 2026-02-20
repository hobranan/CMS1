export function mapScheduleEditError(result) {
  return { status: result.status, body: { code: result.code, message: result.message } };
}
