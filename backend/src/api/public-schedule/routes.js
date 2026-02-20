import { createGetPublicScheduleController } from "./get-public-schedule-controller.js";
import { createGetPublicScheduleEntryController } from "./get-public-schedule-entry-controller.js";
import { createGetPublicSchedulePdfController } from "./get-public-schedule-pdf-controller.js";

export function createPublicScheduleRoutes(deps) {
  const listController = createGetPublicScheduleController(deps);
  const entryController = createGetPublicScheduleEntryController(deps);
  const pdfController = createGetPublicSchedulePdfController(deps);

  return {
    "/api/v1/public/conferences/:conferenceId/schedule:GET": listController.get,
    "/api/v1/public/conferences/:conferenceId/schedule/entries/:entryId:GET": entryController.get,
    "/api/v1/public/conferences/:conferenceId/schedule.pdf:GET": pdfController.get
  };
}
