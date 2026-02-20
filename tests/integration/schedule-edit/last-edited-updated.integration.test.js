import test from "node:test";
import assert from "node:assert/strict";
import { createUc17System } from "../../helpers/uc17_system.js";

test("last edited timestamp updates on successful save", () => {
  const system = createUc17System();
  const editor = system.addEditor("uc17-i4@example.com");
  system.seedConference({ conferenceId: "c17-i4", editLocked: false });
  system.seedPublishedSchedule({ conferenceId: "c17-i4", schedule: { grid: { columns: [] }, placements: [{ paperId: "p1", roomId: "r1", slotIndex: 0 }], conflicts: [] } });

  const one = system.call("/api/v1/conferences/:conferenceId/schedule/save:POST", {
    params: { conferenceId: "c17-i4" },
    body: { expectedVersion: 1, edits: { placements: [{ paperId: "p1", roomId: "r1", slotIndex: 1 }], conflicts: [] } },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(one.status, 200);
  assert.ok(one.body.lastEditedAt);
});
