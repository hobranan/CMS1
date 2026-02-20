import { mapForbiddenAccess } from "./assigned-access-error-mapper.js";
import { mapAssignedAccessFailure } from "./assigned-access-failure-mapper.js";
import { isAssignedToPaper } from "../../services/assigned-access/assignment-authorization-service.js";
import { getAssignedManuscript } from "../../services/assigned-access/assigned-resource-retrieval-service.js";
import { accessError } from "../../services/assigned-access/access-outcome-mapping-service.js";

export function createGetManuscriptViewController(deps) {
  return {
    get: (request) => {
      if (!request.user?.email || request.user?.role !== "referee") {
        return accessError(401, "AUTH_REQUIRED", "Referee authentication is required.");
      }
      const paperId = request.params?.paperId;
      if (!isAssignedToPaper(deps.assignedPaperRepository, request.user.id, paperId)) {
        return mapForbiddenAccess();
      }
      const manuscript = getAssignedManuscript(deps.assignedPaperRepository, paperId);
      if (!manuscript.ok) {
        return mapAssignedAccessFailure(manuscript.status, manuscript.code, manuscript.message);
      }
      return { status: 200, body: manuscript.value };
    }
  };
}

