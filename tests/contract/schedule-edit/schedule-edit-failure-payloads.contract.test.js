import test from "node:test";
import assert from "node:assert/strict";
import { createUc17System } from "../../helpers/uc17_system.js";

test("failure payload shape is stable across stale/lock/conflict", () => {
  const system = createUc17System();
  const editor = system.addEditor("uc17-c8@example.com");
  system.seedConference({ conferenceId: "c17-8", editLocked: false });
  system.seedPublishedSchedule({ conferenceId: "c17-8", schedule: { grid: { columns: [] }, placements: [], conflicts: [] } });

  const stale = system.call("/api/v1/conferences/:conferenceId/schedule/save:POST", {
    params: { conferenceId: "c17-8" },
    body: { expectedVersion: 0, edits: { placements: [], conflicts: [] } },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(typeof stale.body.code, "string");
  assert.equal(typeof stale.body.message, "string");

  system.deps.scheduleDraftRepository.getConference("c17-8").editLocked = true;
  const lock = system.call("/api/v1/conferences/:conferenceId/schedule/save:POST", {
    params: { conferenceId: "c17-8" },
    body: { expectedVersion: 1, edits: { placements: [], conflicts: [] } },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(typeof lock.body.code, "string");
  assert.equal(typeof lock.body.message, "string");

  system.deps.scheduleDraftRepository.getConference("c17-8").editLocked = false;
  const conflict = system.call("/api/v1/conferences/:conferenceId/schedule/save:POST", {
    params: { conferenceId: "c17-8" },
    body: { expectedVersion: 1, edits: { placements: [], conflicts: [{ severity: "blocking" }] } },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(typeof conflict.body.code, "string");
  assert.equal(typeof conflict.body.message, "string");
});
