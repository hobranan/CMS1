import test from "node:test";
import assert from "node:assert/strict";
import { createUc16System } from "../../helpers/uc16_system.js";

test("conflict highlighting blocks publish", () => {
  const system = createUc16System();
  const editor = system.addEditor("uc16-i6@example.com", "admin");
  system.seedConference({ conferenceId: "c16-i6", acceptedPapers: [{ paperId: "p1", blockingConflict: true }], rooms: [{ roomId: "r1", roomName: "A" }], parameters: { slotMinutes: 30, totalSlots: 1, startMinute: 540 } });
  const gen = system.call("/api/v1/conferences/:conferenceId/schedule/generate:POST", { params: { conferenceId: "c16-i6" }, user: { id: editor.id, email: editor.email, role: "admin" } });
  const pub = system.call("/api/v1/conferences/:conferenceId/schedule/drafts/:draftId/publish:POST", { params: { conferenceId: "c16-i6", draftId: gen.body.draftId }, body: { confirm: true }, user: { id: editor.id, email: editor.email, role: "admin" } });
  assert.equal(pub.status, 400);
  assert.ok(pub.body.blockingCount > 0);
});
