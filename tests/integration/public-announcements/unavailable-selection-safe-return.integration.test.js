import test from "node:test";
import assert from "node:assert/strict";
import { createUc22System } from "../../helpers/uc22_system.js";

test("unavailable detail selection returns safe error and list remains available", () => {
  const system = createUc22System();
  system.seedAnnouncements([
    { announcementId: "u1", title: "Will disappear", content: "Temp", publishedAt: "2026-02-20T13:00:00.000Z", isPublic: true }
  ]);
  system.markUnavailable("u1");
  const detail = system.call("/api/v1/public/announcements/:announcementId:GET", { params: { announcementId: "u1" } });
  const list = system.call("/api/v1/public/announcements:GET");
  assert.equal(detail.status, 404);
  assert.equal(list.status, 204);
});

