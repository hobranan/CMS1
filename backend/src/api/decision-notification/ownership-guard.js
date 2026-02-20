import { assertAuthorOwnership } from "../../services/authorization/author-ownership-policy.js";

export function enforceOwnershipOrThrow(repository, { paperId, authorId }) {
  const paper = repository.getPaperForAuthor(paperId, authorId);
  const check = assertAuthorOwnership(paper, authorId);
  if (!check.ok) {
    const err = new Error(check.message);
    err.code = check.code;
    throw err;
  }
  return paper;
}
