import { createGetPublicAnnouncementsListController } from "./get-public-announcements-list-controller.js";
import { createGetPublicAnnouncementDetailController } from "./get-public-announcement-detail-controller.js";

export function createPublicAnnouncementRoutes(deps) {
  const listController = createGetPublicAnnouncementsListController(deps);
  const detailController = createGetPublicAnnouncementDetailController(deps);
  return {
    "/api/v1/public/announcements:GET": listController.get,
    "/api/v1/public/announcements/:announcementId:GET": detailController.get
  };
}

