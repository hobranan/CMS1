export function buildAnnouncementsErrorMessage(code) {
  if (code === "ANNOUNCEMENT_UNAVAILABLE") {
    return "This announcement is no longer available. Returning to the announcements list.";
  }
  if (code === "ANNOUNCEMENT_RETRIEVAL_FAILED") {
    return "Announcements are temporarily unavailable. Please try again.";
  }
  return "Announcements are unavailable right now.";
}

