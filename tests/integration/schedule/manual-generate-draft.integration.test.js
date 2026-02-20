import test from "node:test";
import assert from "node:assert/strict";
import { createUc16System } from "../../helpers/uc16_system.js";

test("manual generation creates a schedule draft", () => {
  const system = createUc16System();
  const editor = system.addEditor("uc16-i1@example.com");
  system.seedConference({
    conferenceId: "c16-i1",
    acceptedPapers: [{ paperId: "p1" }, { paperId: "p2" }],
    rooms: [{ roomId: "r1", roomName: "A" }],
    parameters: { slotMinutes: 30, totalSlots: 2, startMinute: 540 }
  });
  const response = system.call("/api/v1/conferences/:conferenceId/schedule/generate:POST", {
    params: { conferenceId: "c16-i1" },
    body: { seed: 99 },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(response.status, 200);
  assert.ok(response.body.draftId);
});
