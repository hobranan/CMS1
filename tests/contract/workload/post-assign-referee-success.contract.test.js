import test from "node:test";
import assert from "node:assert/strict";
import { createUc09System } from "../../helpers/uc09_system.js";

test("assign referee succeeds when workload is below limit", () => {
  const system = createUc09System();
  system.addEditor("editor@example.com");
  system.deps.refereeWorkloadRetrievalService.seed("r1", 1);
  system.deps.workloadLimitRuleRepository.setConferenceDefault(3, 7);

  const result = system.call("/api/v1/papers/:paperId/assign-referee:POST", {
    params: { paperId: "paper-301" },
    user: { email: "editor@example.com", role: "editor" },
    body: { referee_id: "r1" }
  });

  assert.equal(result.status, 200);
  assert.equal(result.body.status, "ASSIGNMENT_ACCEPTED");
});

