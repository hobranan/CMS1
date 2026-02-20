export function submitManuscript(apiClient, payload, user) {
  return apiClient("/api/v1/submissions:POST", {
    body: payload,
    file: payload.manuscript_file,
    user
  });
}
