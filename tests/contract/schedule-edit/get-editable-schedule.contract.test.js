import test from "node:test";
import assert from "node:assert/strict";
import { createUc17System } from "../../helpers/uc17_system.js";

test("editable schedule details load successfully", () => {
  const system = createUc17System();
  const editor = system.addEditor("uc17-c1@example.com");
  system.seedConference({ conferenceId: "c17-1", editLocked: false });
  system.seedPublishedSchedule({ conferenceId: "c17-1", schedule: { grid: { columns: [] }, placements: [], conflicts: [], lastEditedAt: null } });

  const response = system.call("/api/v1/conferences/:conferenceId/schedule/editable:GET", {
    params: { conferenceId: "c17-1" },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(response.status, 200);
  assert.equal(response.body.status, "published");
});
