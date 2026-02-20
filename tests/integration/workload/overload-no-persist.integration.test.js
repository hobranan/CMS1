import test from "node:test";
import assert from "node:assert/strict";
import { createUc09System } from "../../helpers/uc09_system.js";

test("over-limit rejection does not persist assignment", () => {
  const system = createUc09System();
  system.addEditor("editor@example.com");
  system.deps.refereeWorkloadRetrievalService.seed("r8", 3);
  system.deps.workloadLimitRuleRepository.setConferenceDefault(3, 1);

  const result = system.call("/api/v1/papers/:paperId/assign-referee:POST", {
    params: { paperId: "paper-402" },
    user: { email: "editor@example.com", role: "editor" },
    body: { referee_id: "r8" }
  });
  assert.equal(result.status, 400);
  assert.deepEqual(
    system.deps.workloadAssignmentPersistenceService.getAssignmentsForPaper("paper-402"),
    []
  );
});

