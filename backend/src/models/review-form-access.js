export function asPreGeneratedReviewForm(form) {
  if (!form) return null;
  return {
    paperId: form.paperId,
    reviewFormId: form.reviewFormId,
    preGenerated: Boolean(form.preGenerated)
  };
}

