export function mapScheduleLockFeedback(lockInfo) {
  return { status: 423, body: { code: "SCHEDULE_LOCKED", message: lockInfo.reason } };
}
