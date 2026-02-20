import test from "node:test";
import assert from "node:assert/strict";
import { createUc09System } from "../../helpers/uc09_system.js";

test("get workload returns snapshot with applied rule metadata", () => {
  const system = createUc09System();
  system.addEditor("editor@example.com");
  system.deps.refereeWorkloadRetrievalService.seed("r2", 2);
  system.deps.workloadLimitRuleRepository.setConferenceDefault(4, 9);

  const result = system.call("/api/v1/referees/:refereeId/workload:GET", {
    params: { refereeId: "r2" },
    query: {},
    user: { email: "editor@example.com", role: "editor" }
  });

  assert.equal(result.status, 200);
  assert.equal(result.body.current_workload, 2);
  assert.equal(result.body.applicable_limit, 4);
  assert.equal(result.body.applied_rule_version, 9);
});

