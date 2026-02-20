export function assignReferee(apiClient, paperId, refereeId, user, options = {}) {
  return apiClient("/api/v1/papers/:paperId/assign-referee:POST", {
    params: { paperId },
    user,
    body: {
      referee_id: refereeId,
      track_id: options.trackId,
      role: options.role,
      selection_snapshot: options.selectionSnapshot
    }
  });
}

