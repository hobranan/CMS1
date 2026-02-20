import { resolveWorkloadLimit } from "../../services/workload/workload-limit-resolution-service.js";

export function createGetWorkloadController(deps) {
  return {
    get: (request) => {
      if (!request.user?.email || request.user?.role !== "editor") {
        return {
          status: 401,
          body: { code: "AUTH_REQUIRED", message: "Editor authentication is required." }
        };
      }
      const refereeId = request.params?.refereeId;
      try {
        const currentWorkload = deps.refereeWorkloadRetrievalService.getCurrentWorkload(refereeId);
        const rule = resolveWorkloadLimit(deps.workloadLimitRuleRepository, {
          role: request.query?.role,
          trackId: request.query?.track_id
        });
        return {
          status: 200,
          body: {
            referee_id: refereeId,
            current_workload: currentWorkload,
            applicable_limit: rule.limit,
            applied_rule_id: rule.id,
            applied_rule_version: rule.version
          }
        };
      } catch {
        return {
          status: 503,
          body: {
            code: "WORKLOAD_RETRIEVAL_FAILURE",
            message: "Unable to retrieve workload."
          }
        };
      }
    }
  };
}

