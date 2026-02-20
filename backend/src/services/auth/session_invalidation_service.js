export function invalidateCurrentSession(sessionService, sessionId) {
  if (!sessionId) return false;
  return sessionService.invalidateSession(sessionId);
}
