import test from "node:test";
import assert from "node:assert/strict";
import { createUc16System } from "../../helpers/uc16_system.js";

test("cancel publish keeps draft non-public", () => {
  const system = createUc16System();
  const editor = system.addEditor("uc16-i5@example.com", "admin");
  system.seedConference({ conferenceId: "c16-i5", acceptedPapers: [{ paperId: "p1" }], rooms: [{ roomId: "r1", roomName: "A" }], parameters: { slotMinutes: 30, totalSlots: 1, startMinute: 540 } });
  const gen = system.call("/api/v1/conferences/:conferenceId/schedule/generate:POST", { params: { conferenceId: "c16-i5" }, user: { id: editor.id, email: editor.email, role: "admin" } });
  const cancel = system.call("/api/v1/conferences/:conferenceId/schedule/drafts/:draftId/publish:POST", { params: { conferenceId: "c16-i5", draftId: gen.body.draftId }, body: { confirm: false }, user: { id: editor.id, email: editor.email, role: "admin" } });
  const get = system.call("/api/v1/conferences/:conferenceId/schedule:GET", { params: { conferenceId: "c16-i5" }, user: { id: editor.id, email: editor.email, role: "admin" } });
  assert.equal(cancel.status, 200);
  assert.equal(get.status, 404);
});
