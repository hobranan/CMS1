import { createPostGenerateScheduleController } from "./post-generate-schedule-controller.js";
import { createPostPublishScheduleController } from "./post-publish-schedule-controller.js";
import { createGetPublishedScheduleController } from "./get-published-schedule-controller.js";

export function createScheduleRoutes(deps) {
  const generateController = createPostGenerateScheduleController(deps);
  const publishController = createPostPublishScheduleController(deps);
  const getPublishedController = createGetPublishedScheduleController(deps);

  return {
    "/api/v1/conferences/:conferenceId/schedule/generate:POST": generateController.post,
    "/api/v1/conferences/:conferenceId/schedule/drafts/:draftId/publish:POST": publishController.post,
    "/api/v1/conferences/:conferenceId/schedule:GET": getPublishedController.get
  };
}
