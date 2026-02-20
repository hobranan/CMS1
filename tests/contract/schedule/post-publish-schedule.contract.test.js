import test from "node:test";
import assert from "node:assert/strict";
import { createUc16System } from "../../helpers/uc16_system.js";

test("publish schedule succeeds for draft with no blocking conflicts", () => {
  const system = createUc16System();
  const editor = system.addEditor("uc16-c2@example.com");
  system.seedConference({
    conferenceId: "c16-2",
    acceptedPapers: [{ paperId: "p1" }],
    rooms: [{ roomId: "r1", roomName: "Room 1" }],
    parameters: { slotMinutes: 30, totalSlots: 2, startMinute: 540 }
  });
  const generated = system.call("/api/v1/conferences/:conferenceId/schedule/generate:POST", {
    params: { conferenceId: "c16-2" },
    body: { seed: 5 },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });

  const publish = system.call("/api/v1/conferences/:conferenceId/schedule/drafts/:draftId/publish:POST", {
    params: { conferenceId: "c16-2", draftId: generated.body.draftId },
    body: { confirm: true },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(publish.status, 200);
  assert.equal(publish.body.status, "published");
});
