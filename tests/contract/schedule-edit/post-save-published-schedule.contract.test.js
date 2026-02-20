import test from "node:test";
import assert from "node:assert/strict";
import { createUc17System } from "../../helpers/uc17_system.js";

test("save on published schedule preserves published status", () => {
  const system = createUc17System();
  const editor = system.addEditor("uc17-c3@example.com", "admin");
  system.seedConference({ conferenceId: "c17-3", editLocked: false });
  system.seedPublishedSchedule({ conferenceId: "c17-3", schedule: { grid: { columns: [] }, placements: [{ paperId: "p1", roomId: "r1", slotIndex: 0 }], conflicts: [], status: "published" } });

  const response = system.call("/api/v1/conferences/:conferenceId/schedule/save:POST", {
    params: { conferenceId: "c17-3" },
    body: { expectedVersion: 1, edits: { placements: [{ paperId: "p1", roomId: "r1", slotIndex: 2 }], conflicts: [] } },
    user: { id: editor.id, email: editor.email, role: "admin" }
  });
  assert.equal(response.status, 200);
  assert.equal(response.body.status, "published");
});
