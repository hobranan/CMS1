import test from "node:test";
import assert from "node:assert/strict";
import { createUc16System } from "../../helpers/uc16_system.js";

test("publish blocked when blocking conflicts exist", () => {
  const system = createUc16System();
  const editor = system.addEditor("uc16-c6@example.com");
  system.seedConference({
    conferenceId: "c16-6",
    acceptedPapers: [{ paperId: "p1", blockingConflict: true }],
    rooms: [{ roomId: "r1", roomName: "Room 1" }],
    parameters: { slotMinutes: 30, totalSlots: 1, startMinute: 540 }
  });
  const generated = system.call("/api/v1/conferences/:conferenceId/schedule/generate:POST", {
    params: { conferenceId: "c16-6" },
    body: { seed: 3 },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  const publish = system.call("/api/v1/conferences/:conferenceId/schedule/drafts/:draftId/publish:POST", {
    params: { conferenceId: "c16-6", draftId: generated.body.draftId },
    body: { confirm: true },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(publish.status, 400);
  assert.equal(publish.body.code, "BLOCKING_CONFLICTS");
});
