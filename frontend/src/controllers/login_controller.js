export function submitLogin(apiClient, payload) {
  return apiClient("/api/v1/auth/login:POST", { body: payload });
}

export function checkSession(apiClient, sessionId) {
  return apiClient("/api/v1/auth/session:GET", { sessionId });
}
