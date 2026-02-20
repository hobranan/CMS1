export function mapUploadValidationError(errors) {
  return {
    status: 400,
    body: {
      code: "UPLOAD_VALIDATION_FAILED",
      message: "Allowed formats: .pdf, .doc, .docx, .tex. Maximum size: 7 MB.",
      errors
    }
  };
}
