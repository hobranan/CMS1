export function renderPostPasswordChangeState(result) {
  if (result.status === 200) {
    return "You have been signed out. Sign in with your new password.";
  }
  return "";
}
