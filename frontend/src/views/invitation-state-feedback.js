export function invitationStateFeedback(response) {
  if (response.status === 200 && Array.isArray(response.body?.invitations) && response.body.invitations.length === 0) {
    return "No pending invitations.";
  }
  if (response.status === 400) {
    return response.body?.message ?? "Invitation action is blocked.";
  }
  if (response.status === 409) {
    return "Invitation state changed. Refresh and try again.";
  }
  return "";
}

