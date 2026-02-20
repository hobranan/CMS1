export function assertAuthorOwnership(paper, authorId) {
  if (!paper) return { ok: false, code: "PAPER_NOT_FOUND", status: 404, message: "Paper not found." };
  if (paper.forbidden) return { ok: false, code: "FORBIDDEN", status: 403, message: "You are not allowed to view this paper decision." };
  const ownsPaper = Array.isArray(paper.authors) && paper.authors.includes(authorId);
  if (!ownsPaper) {
    return { ok: false, code: "FORBIDDEN", status: 403, message: "You are not allowed to view this paper decision." };
  }
  return { ok: true };
}
