import test from "node:test";
import assert from "node:assert/strict";
import { createUc09System } from "../../helpers/uc09_system.js";

test("assignment returns 503 when storage fails after validation", () => {
  const system = createUc09System();
  system.addEditor("editor@example.com");
  system.deps.refereeWorkloadRetrievalService.seed("r6", 0);
  system.deps.workloadLimitRuleRepository.setConferenceDefault(3, 1);
  system.deps.workloadAssignmentPersistenceService.failNextWrite();

  const result = system.call("/api/v1/papers/:paperId/assign-referee:POST", {
    params: { paperId: "paper-305" },
    user: { email: "editor@example.com", role: "editor" },
    body: { referee_id: "r6" }
  });

  assert.equal(result.status, 503);
  assert.equal(result.body.code, "WORKLOAD_STORAGE_FAILURE");
});

