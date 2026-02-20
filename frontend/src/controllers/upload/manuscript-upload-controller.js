export function submitManuscriptUpload(apiClient, submissionId, file, user, extra = {}) {
  if (!file) {
    return { status: 400, body: { code: "NO_FILE_SELECTED", message: "No file selected." } };
  }
  return apiClient("/api/v1/submissions/:submissionId/manuscript:POST", {
    params: { submissionId },
    user,
    file,
    body: {
      file_fingerprint: extra.file_fingerprint ?? file.fileName,
      mode: extra.mode ?? "RESTART",
      resume_offset_bytes: extra.resume_offset_bytes ?? 0
    }
  });
}
