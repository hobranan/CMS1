import test from "node:test";
import assert from "node:assert/strict";
import { createUc16System } from "../../helpers/uc16_system.js";

test("slot grid uses equal slot counts and configured interval", () => {
  const system = createUc16System();
  const editor = system.addEditor("uc16-i3@example.com");
  system.seedConference({ conferenceId: "c16-i3", acceptedPapers: [{ paperId: "p1" }], rooms: [{ roomId: "r1", roomName: "A" }, { roomId: "r2", roomName: "B" }], parameters: { slotMinutes: 25, totalSlots: 3, startMinute: 500 } });
  const response = system.call("/api/v1/conferences/:conferenceId/schedule/generate:POST", { params: { conferenceId: "c16-i3" }, user: { id: editor.id, email: editor.email, role: "editor" } });
  assert.equal(response.status, 200);
  assert.equal(response.body.grid.columns[0].slots.length, 3);
  assert.equal(response.body.grid.columns[1].slots.length, 3);
  assert.equal(response.body.grid.columns[0].slots[1].startMinute - response.body.grid.columns[0].slots[0].startMinute, 25);
});
