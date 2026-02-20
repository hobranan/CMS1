import test from "node:test";
import assert from "node:assert/strict";
import { createUc22System } from "../../helpers/uc22_system.js";

test("list visibility is consistent across repeated refreshes", () => {
  const system = createUc22System();
  system.seedAnnouncements([
    { announcementId: "r1", title: "Refresh test", content: "Stable.", publishedAt: "2026-02-20T10:00:00.000Z", isPublic: true }
  ]);
  const first = system.call("/api/v1/public/announcements:GET");
  const second = system.call("/api/v1/public/announcements:GET");
  assert.equal(first.status, 200);
  assert.equal(second.status, 200);
  assert.equal(first.body.items[0].announcementId, second.body.items[0].announcementId);
});

