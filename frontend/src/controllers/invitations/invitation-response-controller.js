export function loadPendingInvitations(apiClient, refereeId, user) {
  return apiClient("/api/v1/referees/:refereeId/invitations/pending:GET", {
    params: { refereeId },
    user
  });
}

export function submitInvitationDecision(apiClient, invitationId, decision, user, expectedStatus = "pending") {
  return apiClient("/api/v1/invitations/:invitationId/response:POST", {
    params: { invitationId },
    user,
    body: { decision, expected_status: expectedStatus }
  });
}

export function cancelInvitationDecision() {
  return { cancelled: true, mutated: false };
}

