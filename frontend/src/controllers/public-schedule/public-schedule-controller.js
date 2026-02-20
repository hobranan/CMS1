export function loadPublicSchedule(apiClient, conferenceId) {
  return apiClient("/api/v1/public/conferences/:conferenceId/schedule:GET", { params: { conferenceId } });
}
