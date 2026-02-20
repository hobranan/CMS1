import test from "node:test";
import assert from "node:assert/strict";
import { createUc09System } from "../../helpers/uc09_system.js";

test("assignment is rejected when workload equals limit", () => {
  const system = createUc09System();
  system.addEditor("editor@example.com");
  system.deps.refereeWorkloadRetrievalService.seed("r3", 3);
  system.deps.workloadLimitRuleRepository.setConferenceDefault(3, 1);

  const result = system.call("/api/v1/papers/:paperId/assign-referee:POST", {
    params: { paperId: "paper-302" },
    user: { email: "editor@example.com", role: "editor" },
    body: { referee_id: "r3" }
  });

  assert.equal(result.status, 400);
  assert.equal(result.body.code, "WORKLOAD_LIMIT_REACHED");
});

