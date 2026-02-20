import test from "node:test";
import assert from "node:assert/strict";
import { createUc09System } from "../../helpers/uc09_system.js";

test("rule precedence resolves track-specific over role-specific over default", () => {
  const system = createUc09System();
  system.addEditor("editor@example.com");
  system.deps.refereeWorkloadRetrievalService.seed("r13", 1);
  system.deps.workloadLimitRuleRepository.setConferenceDefault(5, 1);
  system.deps.workloadLimitRuleRepository.setRoleRule("senior", 4, 2);
  system.deps.workloadLimitRuleRepository.setTrackRule("ai", 2, 3);

  const track = system.call("/api/v1/referees/:refereeId/workload:GET", {
    params: { refereeId: "r13" },
    query: { role: "senior", track_id: "ai" },
    user: { email: "editor@example.com", role: "editor" }
  });
  assert.equal(track.status, 200);
  assert.equal(track.body.applicable_limit, 2);
  assert.equal(track.body.applied_rule_id, "track-ai");

  const role = system.call("/api/v1/referees/:refereeId/workload:GET", {
    params: { refereeId: "r13" },
    query: { role: "senior" },
    user: { email: "editor@example.com", role: "editor" }
  });
  assert.equal(role.body.applicable_limit, 4);
  assert.equal(role.body.applied_rule_id, "role-senior");

  const fallback = system.call("/api/v1/referees/:refereeId/workload:GET", {
    params: { refereeId: "r13" },
    query: {},
    user: { email: "editor@example.com", role: "editor" }
  });
  assert.equal(fallback.body.applicable_limit, 5);
  assert.equal(fallback.body.applied_rule_id, "conference-default");
});

