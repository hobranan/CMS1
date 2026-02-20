export function submitLogin(apiClient, payload) {
  return apiClient("/api/v1/auth/login:POST", { body: payload });
}
