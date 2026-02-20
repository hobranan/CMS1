import test from "node:test";
import assert from "node:assert/strict";
import { createUc16System } from "../../helpers/uc16_system.js";

test("generate schedule returns draft for valid conference inputs", () => {
  const system = createUc16System();
  const editor = system.addEditor("uc16-c1@example.com");
  system.seedConference({
    conferenceId: "c16-1",
    acceptedPapers: [{ paperId: "p1" }, { paperId: "p2" }],
    rooms: [{ roomId: "r1", roomName: "Room 1" }, { roomId: "r2", roomName: "Room 2" }],
    parameters: { slotMinutes: 30, totalSlots: 3, startMinute: 540 }
  });

  const response = system.call("/api/v1/conferences/:conferenceId/schedule/generate:POST", {
    params: { conferenceId: "c16-1" },
    body: { seed: 42 },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(response.status, 200);
  assert.equal(response.body.status, "draft");
});
