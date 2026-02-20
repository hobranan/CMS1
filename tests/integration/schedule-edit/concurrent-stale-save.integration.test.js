import test from "node:test";
import assert from "node:assert/strict";
import { createUc17System } from "../../helpers/uc17_system.js";

test("concurrent stale save returns conflict", () => {
  const system = createUc17System();
  const editor = system.addEditor("uc17-i7@example.com");
  system.seedConference({ conferenceId: "c17-i7", editLocked: false });
  system.seedPublishedSchedule({ conferenceId: "c17-i7", schedule: { grid: { columns: [] }, placements: [{ paperId: "p1", roomId: "r1", slotIndex: 0 }], conflicts: [] } });

  const first = system.call("/api/v1/conferences/:conferenceId/schedule/save:POST", {
    params: { conferenceId: "c17-i7" },
    body: { expectedVersion: 1, edits: { placements: [{ paperId: "p1", roomId: "r1", slotIndex: 1 }], conflicts: [] } },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(first.status, 200);

  const stale = system.call("/api/v1/conferences/:conferenceId/schedule/save:POST", {
    params: { conferenceId: "c17-i7" },
    body: { expectedVersion: 1, edits: { placements: [{ paperId: "p1", roomId: "r1", slotIndex: 2 }], conflicts: [] } },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(stale.status, 409);
});
