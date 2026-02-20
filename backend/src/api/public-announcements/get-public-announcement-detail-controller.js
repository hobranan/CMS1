import { asAnnouncementDetailProjection } from "../../models/announcement-detail-projection.js";
import {
  detailFailureOutcome,
  unavailableDetailOutcome
} from "../../services/public-announcements/public-announcement-fallback-service.js";
import { mapPublicAnnouncementsError } from "./public-announcements-error-mapper.js";

export function createGetPublicAnnouncementDetailController(deps) {
  return {
    get(request = {}) {
      const announcementId = request.params?.announcementId;
      try {
        const item = deps.announcementStore.getById(announcementId);
        if (!item || item.isPublic !== true || item.isAvailable === false) {
          deps.publicAnnouncementsObservabilityService?.record("announcements_detail_unavailable");
          return mapPublicAnnouncementsError(unavailableDetailOutcome());
        }
        deps.publicAnnouncementsObservabilityService?.record("announcements_detail_success");
        return {
          status: 200,
          body: asAnnouncementDetailProjection(item)
        };
      } catch {
        deps.publicAnnouncementsObservabilityService?.record("announcements_detail_failure");
        return mapPublicAnnouncementsError(detailFailureOutcome());
      }
    }
  };
}

