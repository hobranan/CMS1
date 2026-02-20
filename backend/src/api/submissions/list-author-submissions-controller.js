import { mapSubmissionList } from "../../services/submissions/submission-response-mapper.js";

export function createListAuthorSubmissionsController(deps) {
  return {
    listMine: (request) => {
      if (!request.user?.email) {
        return { status: 401, body: { code: "AUTH_REQUIRED", message: "Authentication is required." } };
      }
      const records = deps.paperSubmissionRepository.listByAuthorEmail(request.user.email);
      return mapSubmissionList(records);
    }
  };
}
