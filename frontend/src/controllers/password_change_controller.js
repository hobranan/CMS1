export function submitPasswordChange(apiClient, payload, user, sessionId) {
  return apiClient("/api/v1/account/password:PUT", { body: payload, user, sessionId });
}
