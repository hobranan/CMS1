export function validateDraftSave(editableState) {
  const errors = [];
  const title = String(editableState?.title ?? "").trim();
  const contactEmail = editableState?.contact_email;

  if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(contactEmail))) {
    errors.push({ field: "contact_email", code: "INVALID_EMAIL", message: "Contact email format is invalid." });
  }
  if (title.length > 0 && title.length < 3) {
    errors.push({ field: "title", code: "TITLE_TOO_SHORT", message: "Title must be at least 3 characters when provided." });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateFinalize(editableState) {
  const errors = [];
  const title = String(editableState?.title ?? "").trim();
  const abstract = String(editableState?.abstract ?? "").trim();
  if (!title) {
    errors.push({ field: "title", code: "REQUIRED", message: "Title is required for final submission." });
  }
  if (!abstract) {
    errors.push({ field: "abstract", code: "REQUIRED", message: "Abstract is required for final submission." });
  }
  return { valid: errors.length === 0, errors };
}
