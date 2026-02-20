export function asPublicAnnouncement(payload) {
  return {
    announcementId: String(payload.announcementId),
    title: String(payload.title),
    summary: payload.summary ?? null,
    content: String(payload.content ?? ""),
    publishedAt: payload.publishedAt ?? new Date().toISOString(),
    isPublic: payload.isPublic ?? true,
    isAvailable: payload.isAvailable ?? true
  };
}

