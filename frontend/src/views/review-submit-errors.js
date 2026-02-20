export function renderReviewSubmitErrors(response) {
  if (response.status !== 400) {
    return [];
  }
  return response.body?.errors ?? [];
}

