export function renderRegistrationState(result) {
  if (result.status === 202) {
    return "Check your email for a verification link.";
  }
  if (result.status === 422) {
    return "Please fix the highlighted fields.";
  }
  return "Registration could not be completed.";
}
