import test from "node:test";
import assert from "node:assert/strict";
import { createUc16System } from "../../helpers/uc16_system.js";

test("save failure on generation returns 500 and no draft is stored", () => {
  const system = createUc16System();
  const editor = system.addEditor("uc16-c7@example.com");
  system.seedConference({
    conferenceId: "c16-7",
    acceptedPapers: [{ paperId: "p1" }],
    rooms: [{ roomId: "r1", roomName: "Room 1" }],
    parameters: { slotMinutes: 30, totalSlots: 1, startMinute: 540 }
  });
  system.failNextSave();

  const response = system.call("/api/v1/conferences/:conferenceId/schedule/generate:POST", {
    params: { conferenceId: "c16-7" },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(response.status, 500);
  assert.equal(system.deps.scheduleDraftRepository.drafts.size, 0);
});
