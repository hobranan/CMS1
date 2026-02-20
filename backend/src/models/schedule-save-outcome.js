export function asScheduleSaveOutcome({ status, code = null, message = null, schedule = null }) {
  return { status, code, message, schedule };
}
