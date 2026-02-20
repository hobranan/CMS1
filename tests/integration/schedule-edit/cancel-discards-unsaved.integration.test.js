import test from "node:test";
import assert from "node:assert/strict";
import { createUc17System } from "../../helpers/uc17_system.js";

test("cancel discards unsaved edits", () => {
  const system = createUc17System();
  const editor = system.addEditor("uc17-i6@example.com");
  system.seedConference({ conferenceId: "c17-i6", editLocked: false });
  system.seedPublishedSchedule({ conferenceId: "c17-i6", schedule: { grid: { columns: [] }, placements: [{ paperId: "p1", roomId: "r1", slotIndex: 0 }], conflicts: [] } });

  const cancel = system.call("/api/v1/conferences/:conferenceId/schedule/cancel:POST", {
    params: { conferenceId: "c17-i6" },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  const load = system.call("/api/v1/conferences/:conferenceId/schedule/editable:GET", {
    params: { conferenceId: "c17-i6" },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(cancel.status, 200);
  assert.equal(load.body.placements[0].slotIndex, 0);
});
