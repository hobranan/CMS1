import test from "node:test";
import assert from "node:assert/strict";
import { createUc16System } from "../../helpers/uc16_system.js";

test("generation blocked when no accepted papers", () => {
  const system = createUc16System();
  const editor = system.addEditor("uc16-c4@example.com");
  system.seedConference({
    conferenceId: "c16-4",
    acceptedPapers: [],
    rooms: [{ roomId: "r1", roomName: "Room 1" }],
    parameters: { slotMinutes: 30, totalSlots: 3, startMinute: 540 }
  });

  const response = system.call("/api/v1/conferences/:conferenceId/schedule/generate:POST", {
    params: { conferenceId: "c16-4" },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(response.status, 400);
  assert.equal(response.body.code, "NO_ACCEPTED_PAPERS");
});
