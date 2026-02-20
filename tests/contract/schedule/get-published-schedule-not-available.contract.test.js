import test from "node:test";
import assert from "node:assert/strict";
import { createUc16System } from "../../helpers/uc16_system.js";

test("get published schedule returns 404 when not available", () => {
  const system = createUc16System();
  const editor = system.addEditor("uc16-c8@example.com", "admin");
  system.seedConference({ conferenceId: "c16-8", acceptedPapers: [], rooms: [], parameters: {} });
  const response = system.call("/api/v1/conferences/:conferenceId/schedule:GET", {
    params: { conferenceId: "c16-8" },
    user: { id: editor.id, email: editor.email, role: "admin" }
  });
  assert.equal(response.status, 404);
  assert.equal(response.body.code, "PUBLISHED_SCHEDULE_NOT_AVAILABLE");
});
