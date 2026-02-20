import test from "node:test";
import assert from "node:assert/strict";
import { createUc09System } from "../../helpers/uc09_system.js";

test("updated configured limit is applied on subsequent checks", () => {
  const system = createUc09System();
  system.addEditor("editor@example.com");
  system.deps.refereeWorkloadRetrievalService.seed("r12", 2);
  system.deps.workloadLimitRuleRepository.setConferenceDefault(3, 1);

  const first = system.call("/api/v1/papers/:paperId/assign-referee:POST", {
    params: { paperId: "paper-405" },
    user: { email: "editor@example.com", role: "editor" },
    body: { referee_id: "r12" }
  });
  assert.equal(first.status, 200);

  system.deps.workloadLimitRuleRepository.setConferenceDefault(2, 2);
  const second = system.call("/api/v1/papers/:paperId/assign-referee:POST", {
    params: { paperId: "paper-406" },
    user: { email: "editor@example.com", role: "editor" },
    body: { referee_id: "r12" }
  });
  assert.equal(second.status, 400);
});

