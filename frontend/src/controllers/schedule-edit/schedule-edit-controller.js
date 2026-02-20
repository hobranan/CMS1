export function loadEditableSchedule(apiClient, conferenceId, user) {
  return apiClient("/api/v1/conferences/:conferenceId/schedule/editable:GET", { params: { conferenceId }, user });
}

export function saveEditableSchedule(apiClient, conferenceId, payload, user) {
  return apiClient("/api/v1/conferences/:conferenceId/schedule/save:POST", { params: { conferenceId }, body: payload, user });
}

export function cancelScheduleEdit(apiClient, conferenceId, user) {
  return apiClient("/api/v1/conferences/:conferenceId/schedule/cancel:POST", { params: { conferenceId }, body: {}, user });
}
