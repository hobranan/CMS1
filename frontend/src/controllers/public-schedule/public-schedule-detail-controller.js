export function loadPublicEntryDetail(apiClient, conferenceId, entryId) {
  return apiClient("/api/v1/public/conferences/:conferenceId/schedule/entries/:entryId:GET", { params: { conferenceId, entryId } });
}
