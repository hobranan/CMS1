import test from "node:test";
import assert from "node:assert/strict";
import { createUc17System } from "../../helpers/uc17_system.js";

test("latest timestamp wins across multiple edits", () => {
  const system = createUc17System();
  const editor = system.addEditor("uc17-i5@example.com");
  system.seedConference({ conferenceId: "c17-i5", editLocked: false });
  system.seedPublishedSchedule({ conferenceId: "c17-i5", schedule: { grid: { columns: [] }, placements: [{ paperId: "p1", roomId: "r1", slotIndex: 0 }], conflicts: [] } });

  const a = system.call("/api/v1/conferences/:conferenceId/schedule/save:POST", { params: { conferenceId: "c17-i5" }, body: { expectedVersion: 1, edits: { placements: [{ paperId: "p1", roomId: "r1", slotIndex: 1 }], conflicts: [] } }, user: { id: editor.id, email: editor.email, role: "editor" } });
  const b = system.call("/api/v1/conferences/:conferenceId/schedule/save:POST", { params: { conferenceId: "c17-i5" }, body: { expectedVersion: 2, edits: { placements: [{ paperId: "p1", roomId: "r1", slotIndex: 2 }], conflicts: [] } }, user: { id: editor.id, email: editor.email, role: "editor" } });
  assert.equal(b.status, 200);
  assert.notEqual(a.body.lastEditedAt, b.body.lastEditedAt);
});
