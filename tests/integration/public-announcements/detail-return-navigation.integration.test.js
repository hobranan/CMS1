import test from "node:test";
import assert from "node:assert/strict";
import { createUc22System } from "../../helpers/uc22_system.js";

test("guest can open detail and return to list", () => {
  const system = createUc22System();
  system.seedAnnouncements([
    { announcementId: "d1", title: "Keynote", content: "Starts at 9.", publishedAt: "2026-02-20T12:00:00.000Z", isPublic: true }
  ]);
  const list = system.call("/api/v1/public/announcements:GET");
  const detail = system.call("/api/v1/public/announcements/:announcementId:GET", { params: { announcementId: "d1" } });
  const listAgain = system.call("/api/v1/public/announcements:GET");
  assert.equal(list.status, 200);
  assert.equal(detail.status, 200);
  assert.equal(listAgain.status, 200);
});

