import { finalizeSubmission } from "../../services/submissions/submission-finalization-service.js";

export function createSubmissionController(deps) {
  return {
    submit: (request) => finalizeSubmission(deps, request)
  };
}
