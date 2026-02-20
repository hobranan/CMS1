import test from "node:test";
import assert from "node:assert/strict";
import { createUc09System } from "../../helpers/uc09_system.js";

test("successful assignment increments workload for subsequent checks", () => {
  const system = createUc09System();
  system.addEditor("editor@example.com");
  system.deps.refereeWorkloadRetrievalService.seed("r7", 0);
  system.deps.workloadLimitRuleRepository.setConferenceDefault(2, 1);

  const first = system.call("/api/v1/papers/:paperId/assign-referee:POST", {
    params: { paperId: "paper-401" },
    user: { email: "editor@example.com", role: "editor" },
    body: { referee_id: "r7" }
  });
  assert.equal(first.status, 200);

  const workload = system.call("/api/v1/referees/:refereeId/workload:GET", {
    params: { refereeId: "r7" },
    query: {},
    user: { email: "editor@example.com", role: "editor" }
  });
  assert.equal(workload.status, 200);
  assert.equal(workload.body.current_workload, 1);
});

