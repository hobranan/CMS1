export function asAnnouncementDetailProjection(item) {
  return {
    announcementId: item.announcementId,
    title: item.title,
    content: item.content,
    publishedAt: item.publishedAt
  };
}

