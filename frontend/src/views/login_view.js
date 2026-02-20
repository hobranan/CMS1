export function renderLoginState(result) {
  if (result.status === 200) return "Login successful.";
  if (result.status === 403 && result.body?.code === "EMAIL_UNVERIFIED") {
    return "Verify your email before login. Resend is available.";
  }
  if (result.status === 400) return "Email and password are required.";
  if (result.status === 423) return "Account is temporarily locked.";
  if (result.status === 503) return "Temporary system problem. Please retry later.";
  if (result.status === 401) return "Invalid email or password.";
  return "Login failed.";
}
