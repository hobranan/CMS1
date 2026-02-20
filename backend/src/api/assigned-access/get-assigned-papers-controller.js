import { queryAssignedPapers } from "../../services/assigned-access/assigned-paper-query-service.js";
import { accessError } from "../../services/assigned-access/access-outcome-mapping-service.js";

export function createGetAssignedPapersController(deps) {
  return {
    get: (request) => {
      if (!request.user?.email || request.user?.role !== "referee") {
        return accessError(401, "AUTH_REQUIRED", "Referee authentication is required.");
      }
      const refereeId = request.params?.refereeId;
      if (refereeId !== request.user.id) {
        return accessError(401, "AUTH_REQUIRED", "Referee identity mismatch.");
      }
      try {
        const papers = queryAssignedPapers(deps.assignedPaperRepository, refereeId);
        if (papers.length === 0) {
          return { status: 200, body: { papers: [], message: "No assigned papers." } };
        }
        return { status: 200, body: { papers } };
      } catch {
        return accessError(500, "ASSIGNED_LIST_FAILURE", "Could not load assigned papers.");
      }
    }
  };
}

