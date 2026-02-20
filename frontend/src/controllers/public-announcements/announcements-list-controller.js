export function buildAnnouncementsListViewModel(items) {
  return items.map((item) => ({
    id: item.announcementId,
    title: item.title,
    summary: item.summary,
    publishedAt: item.publishedAt
  }));
}

