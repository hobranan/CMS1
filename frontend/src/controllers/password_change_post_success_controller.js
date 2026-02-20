export function postPasswordChangeNavigation(result) {
  if (result.status === 200 && result.body?.reauthenticate) {
    return "/login";
  }
  return null;
}
