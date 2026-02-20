import test from "node:test";
import assert from "node:assert/strict";
import { createUc17System } from "../../helpers/uc17_system.js";

test("invalid reference save rejection", () => {
  const system = createUc17System();
  const editor = system.addEditor("uc17-c5@example.com");
  system.seedConference({ conferenceId: "c17-5", editLocked: false });
  system.seedPublishedSchedule({ conferenceId: "c17-5", schedule: { grid: { columns: [] }, placements: [], conflicts: [] } });

  const response = system.call("/api/v1/conferences/:conferenceId/schedule/save:POST", {
    params: { conferenceId: "c17-5" },
    body: { expectedVersion: 1, edits: { placements: [{ paperId: "p1", slotIndex: 1 }], conflicts: [] } },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(response.status, 400);
  assert.equal(response.body.code, "INVALID_REFERENCE");
});
