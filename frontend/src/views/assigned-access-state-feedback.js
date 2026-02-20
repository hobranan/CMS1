export function assignedAccessStateFeedback(response) {
  if (response.status === 200 && Array.isArray(response.body?.papers) && response.body.papers.length === 0) {
    return "No assigned papers.";
  }
  if (response.status === 403) {
    return "You are not authorized to access this paper.";
  }
  return "";
}

