import { asPublicAnnouncement } from "./public-announcement.js";

export class AnnouncementStore {
  constructor() {
    this.items = new Map();
    this.failNextList = false;
    this.failNextDetail = false;
  }

  seedAnnouncements(records) {
    for (const record of records) {
      const announcement = asPublicAnnouncement(record);
      this.items.set(announcement.announcementId, announcement);
    }
  }

  getAll() {
    if (this.failNextList) {
      this.failNextList = false;
      const err = new Error("ANNOUNCEMENT_LIST_RETRIEVAL_FAILED");
      err.code = "ANNOUNCEMENT_LIST_RETRIEVAL_FAILED";
      throw err;
    }
    return Array.from(this.items.values());
  }

  getById(announcementId) {
    if (this.failNextDetail) {
      this.failNextDetail = false;
      const err = new Error("ANNOUNCEMENT_DETAIL_RETRIEVAL_FAILED");
      err.code = "ANNOUNCEMENT_DETAIL_RETRIEVAL_FAILED";
      throw err;
    }
    return this.items.get(announcementId) ?? null;
  }

  markUnavailable(announcementId) {
    const item = this.items.get(announcementId);
    if (!item) return;
    item.isAvailable = false;
  }

  failListOnce() {
    this.failNextList = true;
  }

  failDetailOnce() {
    this.failNextDetail = true;
  }
}

