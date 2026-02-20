export class PaperDecisionViewRepository {
  constructor(paperDecisionRepository) {
    this.paperDecisionRepository = paperDecisionRepository;
  }

  getPaperForAuthor(paperId, authorId) {
    const paper = this.paperDecisionRepository.getPaper(paperId);
    if (!paper) return null;
    const ownsPaper = Array.isArray(paper.authors) && paper.authors.includes(authorId);
    return ownsPaper ? paper : { forbidden: true };
  }

  getDecisionForPaper(paperId) {
    return this.paperDecisionRepository.getDecision(paperId);
  }
}
