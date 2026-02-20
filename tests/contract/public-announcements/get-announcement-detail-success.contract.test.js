import test from "node:test";
import assert from "node:assert/strict";
import { createUc22System } from "../../helpers/uc22_system.js";

test("public announcement detail returns 200 for available item", () => {
  const system = createUc22System();
  system.seedAnnouncements([
    { announcementId: "a2", title: "Schedule Update", content: "Rooms updated.", publishedAt: "2026-02-19T10:00:00.000Z", isPublic: true }
  ]);
  const response = system.call("/api/v1/public/announcements/:announcementId:GET", {
    params: { announcementId: "a2" }
  });
  assert.equal(response.status, 200);
  assert.equal(response.body.announcementId, "a2");
});

