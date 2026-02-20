import { asAnnouncementListProjection } from "../../models/announcement-list-projection.js";
import { filterVisiblePublicAnnouncements } from "../../services/public-announcements/public-announcement-visibility-service.js";
import { orderAnnouncementsNewestFirst } from "../../services/public-announcements/public-announcement-ordering-service.js";
import {
  listFailureOutcome,
  noAnnouncementsOutcome
} from "../../services/public-announcements/public-announcement-fallback-service.js";
import { mapPublicAnnouncementsError } from "./public-announcements-error-mapper.js";

export function createGetPublicAnnouncementsListController(deps) {
  return {
    get() {
      try {
        const items = deps.announcementStore.getAll();
        const visible = filterVisiblePublicAnnouncements(items);
        if (visible.length === 0) {
          deps.publicAnnouncementsObservabilityService?.record("announcements_no_data");
          return noAnnouncementsOutcome();
        }
        const ordered = orderAnnouncementsNewestFirst(visible);
        deps.publicAnnouncementsObservabilityService?.record("announcements_list_success");
        return {
          status: 200,
          body: asAnnouncementListProjection(ordered)
        };
      } catch {
        deps.publicAnnouncementsObservabilityService?.record("announcements_list_failure");
        return mapPublicAnnouncementsError(listFailureOutcome());
      }
    }
  };
}

