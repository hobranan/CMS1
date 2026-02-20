export function mapInvitationResponseError(result) {
  if (result.status === 409) {
    return {
      status: 409,
      body: {
        code: "INVITATION_STATE_CONFLICT",
        message: "Invitation state changed. Refresh and try again."
      }
    };
  }
  return result;
}

