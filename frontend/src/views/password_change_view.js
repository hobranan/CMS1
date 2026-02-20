export function renderPasswordChangeResult(result) {
  if (result.status === 200) return "Password changed successfully. Please log in again.";
  if (result.status === 400) return "Please correct the highlighted password fields.";
  if (result.status === 503) return "System problem. Please retry later.";
  return "Password change failed.";
}
