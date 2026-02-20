export function invitationFailureMessage(response) {
  if (response.status === 500) {
    return "Could not record response. Please retry.";
  }
  if (response.status === 200 && response.body?.notificationStatus === "failed") {
    return "Response saved, but notification failed.";
  }
  return "";
}

