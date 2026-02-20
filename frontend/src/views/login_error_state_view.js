export function renderLoginErrorState(result) {
  if (result.status === 423) {
    return "Account temporarily locked. Try again later.";
  }
  if (result.status === 503) {
    return "System problem. Please retry later.";
  }
  if (result.status === 401) {
    return "Invalid email or password.";
  }
  return "Login failed.";
}
