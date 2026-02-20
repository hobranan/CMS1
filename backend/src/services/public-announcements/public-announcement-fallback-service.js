import { asAnnouncementAccessOutcome } from "../../models/announcement-access-outcome.js";

export function noAnnouncementsOutcome() {
  return asAnnouncementAccessOutcome(204);
}

export function listFailureOutcome() {
  return asAnnouncementAccessOutcome(500, {
    code: "ANNOUNCEMENT_RETRIEVAL_FAILED",
    message: "Public announcements could not be retrieved."
  });
}

export function unavailableDetailOutcome() {
  return asAnnouncementAccessOutcome(404, {
    code: "ANNOUNCEMENT_UNAVAILABLE",
    message: "Selected announcement is unavailable."
  });
}

export function detailFailureOutcome() {
  return asAnnouncementAccessOutcome(500, {
    code: "ANNOUNCEMENT_DETAIL_RETRIEVAL_FAILED",
    message: "Announcement detail could not be retrieved."
  });
}

