import test from "node:test";
import assert from "node:assert/strict";
import { createUc09System } from "../../helpers/uc09_system.js";

test("retrieval failure persists no assignment", () => {
  const system = createUc09System();
  system.addEditor("editor@example.com");
  system.deps.refereeWorkloadRetrievalService.failNextRead();

  const result = system.call("/api/v1/papers/:paperId/assign-referee:POST", {
    params: { paperId: "paper-403" },
    user: { email: "editor@example.com", role: "editor" },
    body: { referee_id: "r9" }
  });
  assert.equal(result.status, 503);
  assert.deepEqual(
    system.deps.workloadAssignmentPersistenceService.getAssignmentsForPaper("paper-403"),
    []
  );
});

