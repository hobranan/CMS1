export function requireSession(request, sessionService) {
  const sessionId = request.sessionId;
  if (!sessionId || !sessionService.isSessionActive(sessionId)) {
    return {
      allowed: false,
      response: {
        status: 401,
        body: { code: "SESSION_REQUIRED", message: "Active session required." }
      }
    };
  }
  return { allowed: true };
}
