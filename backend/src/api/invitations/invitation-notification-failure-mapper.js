export function mapNotificationFailureMessage(body) {
  if (body.notificationStatus === "failed") {
    return {
      ...body,
      message: "Response recorded, but notification delivery failed."
    };
  }
  return body;
}

