import test from "node:test";
import assert from "node:assert/strict";
import { createUc16System } from "../../helpers/uc16_system.js";

test("randomized initial placement changes with different seeds", () => {
  const system = createUc16System();
  const editor = system.addEditor("uc16-i4@example.com");
  const conf = {
    conferenceId: "c16-i4",
    acceptedPapers: [{ paperId: "p1" }, { paperId: "p2" }, { paperId: "p3" }],
    rooms: [{ roomId: "r1", roomName: "A" }],
    parameters: { slotMinutes: 30, totalSlots: 3, startMinute: 540 }
  };
  system.seedConference(conf);
  const a = system.call("/api/v1/conferences/:conferenceId/schedule/generate:POST", { params: { conferenceId: "c16-i4" }, body: { seed: 1 }, user: { id: editor.id, email: editor.email, role: "editor" } });
  const b = system.call("/api/v1/conferences/:conferenceId/schedule/generate:POST", { params: { conferenceId: "c16-i4" }, body: { seed: 2 }, user: { id: editor.id, email: editor.email, role: "editor" } });
  assert.notDeepEqual(a.body.placements.map((p) => p.paperId), b.body.placements.map((p) => p.paperId));
});
