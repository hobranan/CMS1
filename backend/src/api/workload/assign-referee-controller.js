import { assignRefereeWithLimit } from "../../services/workload/assign-referee-with-limit-service.js";
import { mapWorkloadFailure } from "./workload-failure-response-mapper.js";
import { mapWorkloadLimitError } from "./workload-error-mapper.js";

export function createAssignRefereeController(deps) {
  return {
    assign: (request) => {
      if (!request.user?.email || request.user?.role !== "editor") {
        return {
          status: 401,
          body: {
            code: "AUTH_REQUIRED",
            message: "Editor authentication is required."
          }
        };
      }
      const result = assignRefereeWithLimit(deps, {
        paperId: request.params?.paperId,
        refereeId: request.body?.referee_id,
        role: request.body?.role,
        trackId: request.body?.track_id,
        selectionSnapshot: request.body?.selection_snapshot
      });
      if (result.status === 400 || result.status === 409) {
        return mapWorkloadLimitError(result.body.code);
      }
      if (result.status === 503) {
        return mapWorkloadFailure(result.body.code);
      }
      return result;
    }
  };
}

