import test from "node:test";
import assert from "node:assert/strict";
import { createUc17System } from "../../helpers/uc17_system.js";

test("edit load/save p95 stays below target in local harness", () => {
  const system = createUc17System();
  const editor = system.addEditor("uc17-i8@example.com");
  system.seedConference({ conferenceId: "c17-i8", editLocked: false });
  system.seedPublishedSchedule({ conferenceId: "c17-i8", schedule: { grid: { columns: [] }, placements: [{ paperId: "p1", roomId: "r1", slotIndex: 0 }], conflicts: [] } });

  const samples = [];
  for (let i = 0; i < 25; i += 1) {
    const start = performance.now();
    const load = system.call("/api/v1/conferences/:conferenceId/schedule/editable:GET", { params: { conferenceId: "c17-i8" }, user: { id: editor.id, email: editor.email, role: "editor" } });
    assert.equal(load.status, 200);
    const save = system.call("/api/v1/conferences/:conferenceId/schedule/save:POST", { params: { conferenceId: "c17-i8" }, body: { expectedVersion: i + 1, edits: { placements: [{ paperId: "p1", roomId: "r1", slotIndex: i % 4 }], conflicts: [] } }, user: { id: editor.id, email: editor.email, role: "editor" } });
    assert.equal(save.status, 200);
    samples.push(performance.now() - start);
  }

  const sorted = [...samples].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95) - 1] ?? sorted[sorted.length - 1];
  assert.ok(p95 < 400, `expected p95 < 400ms, got ${p95}`);
});
