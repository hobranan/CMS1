export function renderAssignmentErrors(response) {
  if (response.status !== 400) {
    return [];
  }
  return response.body?.errors ?? [];
}

