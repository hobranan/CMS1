export function generateSchedule(apiClient, conferenceId, payload, user) {
  return apiClient("/api/v1/conferences/:conferenceId/schedule/generate:POST", {
    params: { conferenceId },
    body: payload,
    user
  });
}
