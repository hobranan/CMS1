import test from "node:test";
import assert from "node:assert/strict";
import { createUc17System } from "../../helpers/uc17_system.js";

test("locked schedule blocks edit save", () => {
  const system = createUc17System();
  const editor = system.addEditor("uc17-c6@example.com");
  system.seedConference({ conferenceId: "c17-6", editLocked: true, lockReason: "Publishing window lock." });
  system.seedPublishedSchedule({ conferenceId: "c17-6", schedule: { grid: { columns: [] }, placements: [], conflicts: [] } });

  const response = system.call("/api/v1/conferences/:conferenceId/schedule/save:POST", {
    params: { conferenceId: "c17-6" },
    body: { expectedVersion: 1, edits: { placements: [], conflicts: [] } },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(response.status, 423);
  assert.equal(response.body.code, "SCHEDULE_LOCKED");
});
