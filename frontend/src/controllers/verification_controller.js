export function verifyToken(apiClient, token) {
  return apiClient("/api/v1/registrations/verify:GET", { query: { token } });
}

export function resendVerification(apiClient, email) {
  return apiClient("/api/v1/registrations/resend-confirmation:POST", { body: { email } });
}
