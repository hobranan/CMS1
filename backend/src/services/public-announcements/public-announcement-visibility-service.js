export function filterVisiblePublicAnnouncements(items) {
  return items.filter((item) => item.isPublic === true && item.isAvailable !== false);
}

