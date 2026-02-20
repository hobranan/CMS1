import test from "node:test";
import assert from "node:assert/strict";
import { createUc17System } from "../../helpers/uc17_system.js";

test("edit published schedule keeps status published", () => {
  const system = createUc17System();
  const editor = system.addEditor("uc17-i3@example.com");
  system.seedConference({ conferenceId: "c17-i3", editLocked: false });
  system.seedPublishedSchedule({ conferenceId: "c17-i3", schedule: { status: "published", grid: { columns: [] }, placements: [{ paperId: "p1", roomId: "r1", slotIndex: 1 }], conflicts: [] } });

  const response = system.call("/api/v1/conferences/:conferenceId/schedule/save:POST", {
    params: { conferenceId: "c17-i3" },
    body: { expectedVersion: 1, edits: { placements: [{ paperId: "p1", roomId: "r1", slotIndex: 2 }], conflicts: [] } },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(response.status, 200);
  assert.equal(response.body.status, "published");
});
