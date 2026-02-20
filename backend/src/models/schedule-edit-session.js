export function startEditSession({ conferenceId, baseVersion, userId }) {
  return {
    sessionId: `${conferenceId}:${userId}:${Date.now()}`,
    conferenceId,
    userId,
    baseVersion,
    status: "editing"
  };
}
