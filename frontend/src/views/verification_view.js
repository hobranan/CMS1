export function renderVerificationState(result) {
  if (result.status === 200) {
    return "Email verified. You can now log in.";
  }
  if (result.status === 410) {
    return "Verification link expired. Request a new one.";
  }
  return "Verification failed.";
}
