export function orderAnnouncementsNewestFirst(items) {
  return items.slice().sort((a, b) => {
    if (a.publishedAt === b.publishedAt) {
      return b.announcementId.localeCompare(a.announcementId);
    }
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

