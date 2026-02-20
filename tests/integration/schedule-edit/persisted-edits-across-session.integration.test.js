import test from "node:test";
import assert from "node:assert/strict";
import { createUc17System } from "../../helpers/uc17_system.js";

test("saved edits persist across repeated load", () => {
  const system = createUc17System();
  const editor = system.addEditor("uc17-i2@example.com");
  system.seedConference({ conferenceId: "c17-i2", editLocked: false });
  system.seedPublishedSchedule({ conferenceId: "c17-i2", schedule: { grid: { columns: [] }, placements: [{ paperId: "p1", roomId: "r1", slotIndex: 1 }], conflicts: [] } });

  system.call("/api/v1/conferences/:conferenceId/schedule/save:POST", {
    params: { conferenceId: "c17-i2" },
    body: { expectedVersion: 1, edits: { placements: [{ paperId: "p1", roomId: "r1", slotIndex: 2 }], conflicts: [] } },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });

  const first = system.call("/api/v1/conferences/:conferenceId/schedule/editable:GET", { params: { conferenceId: "c17-i2" }, user: { id: editor.id, email: editor.email, role: "editor" } });
  const second = system.call("/api/v1/conferences/:conferenceId/schedule/editable:GET", { params: { conferenceId: "c17-i2" }, user: { id: editor.id, email: editor.email, role: "editor" } });
  assert.equal(first.body.placements[0].slotIndex, 2);
  assert.equal(second.body.placements[0].slotIndex, 2);
});
