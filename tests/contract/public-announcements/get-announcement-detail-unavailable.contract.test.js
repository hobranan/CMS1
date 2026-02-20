import test from "node:test";
import assert from "node:assert/strict";
import { createUc22System } from "../../helpers/uc22_system.js";

test("public announcement detail returns 404 when unavailable", () => {
  const system = createUc22System();
  system.seedAnnouncements([
    { announcementId: "a3", title: "Withdrawn", content: "No longer visible.", publishedAt: "2026-02-19T11:00:00.000Z", isPublic: true }
  ]);
  system.markUnavailable("a3");
  const response = system.call("/api/v1/public/announcements/:announcementId:GET", {
    params: { announcementId: "a3" }
  });
  assert.equal(response.status, 404);
  assert.equal(response.body.code, "ANNOUNCEMENT_UNAVAILABLE");
});

