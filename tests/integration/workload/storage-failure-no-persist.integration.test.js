import test from "node:test";
import assert from "node:assert/strict";
import { createUc09System } from "../../helpers/uc09_system.js";

test("storage failure does not persist assignment or increment workload", () => {
  const system = createUc09System();
  system.addEditor("editor@example.com");
  system.deps.refereeWorkloadRetrievalService.seed("r10", 0);
  system.deps.workloadLimitRuleRepository.setConferenceDefault(3, 1);
  system.deps.workloadAssignmentPersistenceService.failNextWrite();

  const result = system.call("/api/v1/papers/:paperId/assign-referee:POST", {
    params: { paperId: "paper-404" },
    user: { email: "editor@example.com", role: "editor" },
    body: { referee_id: "r10" }
  });
  assert.equal(result.status, 503);
  assert.deepEqual(
    system.deps.workloadAssignmentPersistenceService.getAssignmentsForPaper("paper-404"),
    []
  );

  const workload = system.call("/api/v1/referees/:refereeId/workload:GET", {
    params: { refereeId: "r10" },
    query: {},
    user: { email: "editor@example.com", role: "editor" }
  });
  assert.equal(workload.body.current_workload, 0);
});

