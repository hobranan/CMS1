export function renderLoginState(result) {
  if (result.status === 200) return "Login successful.";
  if (result.status === 403 && result.body?.code === "EMAIL_UNVERIFIED") {
    return "Verify your email before login. Resend is available.";
  }
  return "Login failed.";
}
