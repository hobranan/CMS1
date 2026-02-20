import test from "node:test";
import assert from "node:assert/strict";
import { createUc08System } from "../../helpers/uc08_system.js";

test("invitation failure rolls back assignment with no partial result", () => {
  const system = createUc08System();
  system.addEditor("editor@example.com");
  const paperId = system.seedPaper("paper-202");
  system.seedReferee("r1");
  system.seedReferee("r2");
  system.deps.reviewInvitationService.failNextDispatch();

  const failed = system.call("/api/v1/papers/:paperId/assignments:POST", {
    params: { paperId },
    user: { email: "editor@example.com", role: "editor" },
    body: { referee_ids: ["r1", "r2"], expected_version: 0 }
  });
  assert.equal(failed.status, 503);

  const assignment = system.deps.paperRefereeAssignmentRepository.getAssignment(paperId);
  assert.deepEqual(assignment.refereeIds, []);
  assert.equal(system.deps.reviewInvitationService.sentInvitations.length, 0);
});

