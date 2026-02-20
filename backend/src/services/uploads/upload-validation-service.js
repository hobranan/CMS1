const ALLOWED_EXTENSIONS = new Set([".pdf", ".doc", ".docx", ".tex"]);
const MAX_BYTES = 7 * 1024 * 1024;

function extensionOf(name) {
  const value = String(name ?? "");
  const idx = value.lastIndexOf(".");
  if (idx < 0) return "";
  return value.slice(idx).toLowerCase();
}

export function validateUploadCandidate(file) {
  const errors = [];
  if (!file) {
    errors.push({ field: "file", code: "REQUIRED_FILE", message: "Manuscript file is required." });
    return { errors, extension: "" };
  }
  const ext = extensionOf(file.fileName);
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    errors.push({ field: "file", code: "UNSUPPORTED_EXTENSION", message: "Allowed formats: .pdf, .doc, .docx, .tex." });
  }
  if (Number(file.sizeBytes ?? 0) > MAX_BYTES) {
    errors.push({ field: "file", code: "FILE_TOO_LARGE", message: "Maximum file size is 7 MB." });
  }
  return { errors, extension: ext };
}
