export function confirmAssignment(apiClient, paperId, refereeIds, expectedVersion, user) {
  return apiClient("/api/v1/papers/:paperId/assignments:POST", {
    params: { paperId },
    user,
    body: {
      referee_ids: refereeIds,
      expected_version: expectedVersion
    }
  });
}

