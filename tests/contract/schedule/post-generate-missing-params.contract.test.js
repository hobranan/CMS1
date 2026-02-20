import test from "node:test";
import assert from "node:assert/strict";
import { createUc16System } from "../../helpers/uc16_system.js";

test("generation blocked when parameters are missing", () => {
  const system = createUc16System();
  const editor = system.addEditor("uc16-c5@example.com");
  system.seedConference({
    conferenceId: "c16-5",
    acceptedPapers: [{ paperId: "p1" }],
    rooms: [{ roomId: "r1", roomName: "Room 1" }],
    parameters: { totalSlots: 3 }
  });

  const response = system.call("/api/v1/conferences/:conferenceId/schedule/generate:POST", {
    params: { conferenceId: "c16-5" },
    user: { id: editor.id, email: editor.email, role: "editor" }
  });
  assert.equal(response.status, 400);
  assert.equal(response.body.code, "MISSING_PARAMETERS");
});
