export function asViewOnlyManuscript(manuscript) {
  if (!manuscript) return null;
  return {
    paperId: manuscript.paperId,
    contentUrl: manuscript.contentUrl,
    accessMode: "view_only"
  };
}

