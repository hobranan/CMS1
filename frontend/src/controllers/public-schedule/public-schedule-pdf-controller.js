export function loadSchedulePdf(apiClient, conferenceId, disposition = "inline") {
  return apiClient("/api/v1/public/conferences/:conferenceId/schedule.pdf:GET", { params: { conferenceId }, query: { disposition } });
}
