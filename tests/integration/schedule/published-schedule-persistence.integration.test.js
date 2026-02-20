import test from "node:test";
import assert from "node:assert/strict";
import { createUc16System } from "../../helpers/uc16_system.js";

test("published schedule remains available across repeated retrieval", () => {
  const system = createUc16System();
  const editor = system.addEditor("uc16-i7@example.com", "admin");
  system.seedConference({ conferenceId: "c16-i7", acceptedPapers: [{ paperId: "p1" }], rooms: [{ roomId: "r1", roomName: "A" }], parameters: { slotMinutes: 30, totalSlots: 1, startMinute: 540 } });
  const gen = system.call("/api/v1/conferences/:conferenceId/schedule/generate:POST", { params: { conferenceId: "c16-i7" }, user: { id: editor.id, email: editor.email, role: "admin" } });
  system.call("/api/v1/conferences/:conferenceId/schedule/drafts/:draftId/publish:POST", { params: { conferenceId: "c16-i7", draftId: gen.body.draftId }, body: { confirm: true }, user: { id: editor.id, email: editor.email, role: "admin" } });
  const first = system.call("/api/v1/conferences/:conferenceId/schedule:GET", { params: { conferenceId: "c16-i7" }, user: { id: editor.id, email: editor.email, role: "admin" } });
  const second = system.call("/api/v1/conferences/:conferenceId/schedule:GET", { params: { conferenceId: "c16-i7" }, user: { id: editor.id, email: editor.email, role: "admin" } });
  assert.equal(first.status, 200);
  assert.equal(second.status, 200);
});
