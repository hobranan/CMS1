export function asAnnouncementListProjection(items) {
  return {
    ordering: "published_at_desc_then_id_desc",
    items: items.map((item) => ({
      announcementId: item.announcementId,
      title: item.title,
      summary: item.summary ?? null,
      publishedAt: item.publishedAt
    }))
  };
}

