import test from "node:test";
import assert from "node:assert/strict";
import { createUc22System } from "../../helpers/uc22_system.js";

test("single-item announcement list supports detail flow", () => {
  const system = createUc22System();
  system.seedAnnouncements([
    { announcementId: "s1", title: "Only one", content: "Single item content.", publishedAt: "2026-02-20T12:30:00.000Z", isPublic: true }
  ]);
  const list = system.call("/api/v1/public/announcements:GET");
  const detail = system.call("/api/v1/public/announcements/:announcementId:GET", {
    params: { announcementId: "s1" }
  });
  assert.equal(list.body.items.length, 1);
  assert.equal(detail.body.announcementId, "s1");
});

