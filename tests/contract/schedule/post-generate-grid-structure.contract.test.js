import test from "node:test";
import assert from "node:assert/strict";
import { createUc16System } from "../../helpers/uc16_system.js";

test("generate response includes room columns and equal slot counts", () => {
  const system = createUc16System();
  const editor = system.addEditor("uc16-c3@example.com");
  system.seedConference({
    conferenceId: "c16-3",
    acceptedPapers: [{ paperId: "p1" }, { paperId: "p2" }],
    rooms: [{ roomId: "r1", roomName: "Room 1" }, { roomId: "r2", roomName: "Room 2" }],
    parameters: { slotMinutes: 20, totalSlots: 4, startMinute: 600 }
  });

  const response = system.call("/api/v1/conferences/:conferenceId/schedule/generate:POST", {
    params: { conferenceId: "c16-3" },
    body: { seed: 7 },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.grid.columns.length, 2);
  assert.equal(response.body.grid.columns[0].slots.length, 4);
  assert.equal(response.body.grid.columns[1].slots.length, 4);
});
