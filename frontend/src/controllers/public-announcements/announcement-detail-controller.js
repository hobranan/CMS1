export function buildAnnouncementDetailViewModel(detail) {
  return {
    title: detail.title,
    content: detail.content,
    publishedAt: detail.publishedAt
  };
}

