export function getUploadRetryMessage(response) {
  if (response.status === 503) {
    return "Upload interrupted or service unavailable. Retry upload.";
  }
  if (response.status === 409) {
    return "File was not attached. Retry upload.";
  }
  return "Upload failed.";
}
