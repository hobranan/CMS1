import test from "node:test";
import assert from "node:assert/strict";
import { createUc17System } from "../../helpers/uc17_system.js";

test("conflict-based save rejection returns unchanged schedule", () => {
  const system = createUc17System();
  const editor = system.addEditor("uc17-c4@example.com");
  system.seedConference({ conferenceId: "c17-4", editLocked: false });
  system.seedPublishedSchedule({ conferenceId: "c17-4", schedule: { grid: { columns: [] }, placements: [{ paperId: "p1", roomId: "r1", slotIndex: 0 }], conflicts: [] } });

  const response = system.call("/api/v1/conferences/:conferenceId/schedule/save:POST", {
    params: { conferenceId: "c17-4" },
    body: { expectedVersion: 1, edits: { placements: [{ paperId: "p1", roomId: "r1", slotIndex: 0 }], conflicts: [{ severity: "blocking" }] } },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(response.status, 400);
  assert.equal(system.deps.scheduleDraftRepository.getPublished("c17-4").placements[0].slotIndex, 0);
});
