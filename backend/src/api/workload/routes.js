import { createAssignRefereeController } from "./assign-referee-controller.js";
import { createGetWorkloadController } from "./get-workload-controller.js";

export function createWorkloadRoutes(deps) {
  const assignController = createAssignRefereeController(deps);
  const getController = createGetWorkloadController(deps);
  return {
    "/api/v1/papers/:paperId/assign-referee:POST": assignController.assign,
    "/api/v1/referees/:refereeId/workload:GET": getController.get
  };
}

