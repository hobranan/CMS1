import { createRetryUploadController } from "./retry-upload-controller.js";
import { createUploadManuscriptController } from "./upload-manuscript-controller.js";

export function createUploadRoutes(deps) {
  const uploadController = createUploadManuscriptController(deps);
  const retryController = createRetryUploadController(deps);
  return {
    "/api/v1/submissions/:submissionId/manuscript:POST": uploadController.upload,
    "/api/v1/submissions/:submissionId/manuscript/retry:POST": retryController.retryMode
  };
}
