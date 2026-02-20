import test from "node:test";
import assert from "node:assert/strict";
import { createUc09System } from "../../helpers/uc09_system.js";

test("assignment returns 409 when workload/limit drift is detected at confirm", () => {
  const system = createUc09System();
  system.addEditor("editor@example.com");
  system.deps.refereeWorkloadRetrievalService.seed("r11", 1);
  system.deps.workloadLimitRuleRepository.setConferenceDefault(4, 1);

  const result = system.call("/api/v1/papers/:paperId/assign-referee:POST", {
    params: { paperId: "paper-306" },
    user: { email: "editor@example.com", role: "editor" },
    body: {
      referee_id: "r11",
      selection_snapshot: {
        current_workload: 0,
        limit: 4
      }
    }
  });

  assert.equal(result.status, 409);
  assert.equal(result.body.code, "WORKLOAD_REFRESH_REQUIRED");
});

