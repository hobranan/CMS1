import test from "node:test";
import assert from "node:assert/strict";
import { createUc17System } from "../../helpers/uc17_system.js";

test("database save failure returns error with no persisted changes", () => {
  const system = createUc17System();
  const editor = system.addEditor("uc17-c7@example.com");
  system.seedConference({ conferenceId: "c17-7", editLocked: false });
  system.seedPublishedSchedule({ conferenceId: "c17-7", schedule: { grid: { columns: [] }, placements: [{ paperId: "p1", roomId: "r1", slotIndex: 0 }], conflicts: [] } });
  system.failNextEditSave();

  const response = system.call("/api/v1/conferences/:conferenceId/schedule/save:POST", {
    params: { conferenceId: "c17-7" },
    body: { expectedVersion: 1, edits: { placements: [{ paperId: "p1", roomId: "r1", slotIndex: 2 }], conflicts: [] } },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(response.status, 500);
  assert.equal(system.deps.scheduleDraftRepository.getPublished("c17-7").placements[0].slotIndex, 0);
});
