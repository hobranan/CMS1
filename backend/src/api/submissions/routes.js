import { createSubmissionController } from "./submission-controller.js";
import { createListAuthorSubmissionsController } from "./list-author-submissions-controller.js";
import { createUploadStatusController } from "./upload-status-controller.js";

export function createSubmissionRoutes(deps) {
  const submissionController = createSubmissionController(deps);
  const listController = createListAuthorSubmissionsController(deps);
  const uploadStatusController = createUploadStatusController(deps);

  return {
    "/api/v1/submissions:POST": submissionController.submit,
    "/api/v1/submissions/mine:GET": listController.listMine,
    "/api/v1/submissions/upload-status:POST": uploadStatusController.reportStatus
  };
}
