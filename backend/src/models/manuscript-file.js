const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/x-latex",
  "text/x-tex"
]);

const MAX_BYTES = 7 * 1024 * 1024;

export function validateManuscriptFile(file) {
  const errors = [];
  if (!file) {
    errors.push({ field: "manuscript_file", code: "REQUIRED_FILE", message: "Manuscript file is required." });
    return { errors };
  }
  if (!ALLOWED_TYPES.has(file.contentType)) {
    errors.push({ field: "manuscript_file", code: "UNSUPPORTED_FORMAT", message: "Only PDF, Word, or LaTeX files are allowed." });
  }
  if (Number(file.sizeBytes ?? 0) > MAX_BYTES) {
    errors.push({ field: "manuscript_file", code: "FILE_TOO_LARGE", message: "File size must be 7 MB or less." });
  }
  return { errors };
}
