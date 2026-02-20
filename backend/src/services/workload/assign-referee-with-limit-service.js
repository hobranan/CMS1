import { createWorkloadSnapshot } from "../../models/workload-snapshot.js";
import { decideAssignment } from "./workload-assignment-decision-service.js";
import { recordAssignmentAttempt } from "./workload-attempt-logging-service.js";
import { resolveWorkloadLimit } from "./workload-limit-resolution-service.js";

export function assignRefereeWithLimit(deps, requestModel) {
  const now = deps.nowProvider ? deps.nowProvider() : new Date();
  const { paperId, refereeId, trackId, role, selectionSnapshot } = requestModel;

  let resolvedRule;
  let currentWorkload;
  try {
    resolvedRule = resolveWorkloadLimit(deps.workloadLimitRuleRepository, { trackId, role });
    currentWorkload = deps.refereeWorkloadRetrievalService.getCurrentWorkload(refereeId);
  } catch {
    recordAssignmentAttempt(deps.paperAssignmentAttemptRepository, {
      paperId,
      refereeId,
      outcome: "SYSTEM_FAILURE",
      now
    });
    return {
      status: 503,
      body: {
        code: "WORKLOAD_RETRIEVAL_FAILURE",
        message: "Unable to retrieve workload or limit configuration. Retry later."
      }
    };
  }

  deps.workloadRuleObservabilityService?.record("workload_rule_applied", {
    paper_id: paperId,
    referee_id: refereeId,
    rule_id: resolvedRule.id,
    rule_version: resolvedRule.version,
    source: resolvedRule.source
  });

  const decision = decideAssignment({
    currentWorkload,
    limit: resolvedRule.limit,
    selectionSnapshot
  });
  if (!decision.allowed) {
    recordAssignmentAttempt(deps.paperAssignmentAttemptRepository, {
      paperId,
      refereeId,
      outcome: decision.status === 409 ? "REJECTED_REFRESH_REQUIRED" : "REJECTED_LIMIT",
      now
    });
    return {
      status: decision.status,
      body: {
        code: decision.code,
        message: decision.message
      }
    };
  }

  try {
    deps.workloadAssignmentPersistenceService.persist({ paperId, refereeId });
    deps.refereeWorkloadRetrievalService.increment(refereeId);
  } catch {
    recordAssignmentAttempt(deps.paperAssignmentAttemptRepository, {
      paperId,
      refereeId,
      outcome: "SYSTEM_FAILURE",
      now
    });
    return {
      status: 503,
      body: {
        code: "WORKLOAD_STORAGE_FAILURE",
        message: "Assignment could not be stored. Retry later."
      }
    };
  }

  recordAssignmentAttempt(deps.paperAssignmentAttemptRepository, {
    paperId,
    refereeId,
    outcome: "ACCEPTED",
    now
  });
  return {
    status: 200,
    body: {
      status: "ASSIGNMENT_ACCEPTED",
      paper_id: paperId,
      referee_id: refereeId,
      workload_snapshot: createWorkloadSnapshot({
        refereeId,
        currentWorkload,
        limit: resolvedRule.limit,
        ruleId: resolvedRule.id,
        ruleVersion: resolvedRule.version
      })
    }
  };
}

