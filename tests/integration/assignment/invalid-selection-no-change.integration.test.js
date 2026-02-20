import test from "node:test";
import assert from "node:assert/strict";
import { createUc08System } from "../../helpers/uc08_system.js";

test("invalid selection keeps existing assignment unchanged", () => {
  const system = createUc08System();
  system.addEditor("editor@example.com");
  const paperId = system.seedPaper("paper-201");
  system.seedReferee("r1");
  system.seedReferee("r2", { eligible: false });

  const success = system.call("/api/v1/papers/:paperId/assignments:POST", {
    params: { paperId },
    user: { email: "editor@example.com", role: "editor" },
    body: { referee_ids: ["r1"], expected_version: 0 }
  });
  assert.equal(success.status, 200);

  const invalid = system.call("/api/v1/papers/:paperId/assignments:POST", {
    params: { paperId },
    user: { email: "editor@example.com", role: "editor" },
    body: { referee_ids: ["r2"], expected_version: 1 }
  });
  assert.equal(invalid.status, 400);

  const assignment = system.deps.paperRefereeAssignmentRepository.getAssignment(paperId);
  assert.deepEqual(assignment.refereeIds, ["r1"]);
});

