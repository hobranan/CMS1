import { createGetEditableScheduleController } from "./get-editable-schedule-controller.js";
import { createPostSaveScheduleController } from "./post-save-schedule-controller.js";
import { createPostCancelScheduleEditController } from "./post-cancel-schedule-edit-controller.js";

export function createScheduleEditRoutes(deps) {
  const getController = createGetEditableScheduleController(deps);
  const saveController = createPostSaveScheduleController(deps);
  const cancelController = createPostCancelScheduleEditController(deps);

  return {
    "/api/v1/conferences/:conferenceId/schedule/editable:GET": getController.get,
    "/api/v1/conferences/:conferenceId/schedule/save:POST": saveController.post,
    "/api/v1/conferences/:conferenceId/schedule/cancel:POST": cancelController.post
  };
}
