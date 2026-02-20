import test from "node:test";
import assert from "node:assert/strict";
import { createUc08System } from "../../helpers/uc08_system.js";

test("successful assignment persists full set and sends invitations", () => {
  const system = createUc08System();
  system.addEditor("editor@example.com");
  const paperId = system.seedPaper("paper-200");
  system.seedReferee("r1");
  system.seedReferee("r2");

  const result = system.call("/api/v1/papers/:paperId/assignments:POST", {
    params: { paperId },
    user: { email: "editor@example.com", role: "editor" },
    body: { referee_ids: ["r1", "r2"], expected_version: 0 }
  });

  assert.equal(result.status, 200);
  const assignment = system.deps.paperRefereeAssignmentRepository.getAssignment(paperId);
  assert.deepEqual(assignment.refereeIds, ["r1", "r2"]);
  assert.equal(system.deps.reviewInvitationService.sentInvitations.length, 2);
});

