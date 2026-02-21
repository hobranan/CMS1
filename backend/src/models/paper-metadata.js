function normalizePhone(rawPhone) {
  if (!rawPhone) return null;
  if (!/^[0-9+\-()\s]+$/.test(rawPhone)) {
    return { valid: false, normalized: null };
  }
  const digits = rawPhone.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) {
    return { valid: false, normalized: null };
  }
  return { valid: true, normalized: digits };
}

export function normalizeMetadata(input) {
  return {
    authorNames: String(input.author_names ?? "").trim(),
    authorAffiliations: String(input.author_affiliations ?? "").trim(),
    authorContactEmail: String(input.author_contact_email ?? "").trim().toLowerCase(),
    authorContactPhone: String(input.author_contact_phone ?? "").trim(),
    abstractText: String(input.abstract_text ?? "").trim(),
    keywords: String(input.keywords ?? "").trim(),
    mainReferenceSource: String(input.main_reference_source ?? "").trim()
  };
}

export function validateMetadata(metadata) {
  const errors = [];
  if (!metadata.authorNames) errors.push({ field: "author_names", code: "REQUIRED", message: "Author names are required." });
  if (!metadata.authorAffiliations) errors.push({ field: "author_affiliations", code: "REQUIRED", message: "Author affiliations are required." });
  if (!metadata.authorContactEmail) {
    errors.push({ field: "author_contact_email", code: "REQUIRED", message: "Primary contact email is required." });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(metadata.authorContactEmail)) {
    errors.push({ field: "author_contact_email", code: "INVALID_EMAIL", message: "Primary contact email is invalid." });
  }
  if (!metadata.abstractText) errors.push({ field: "abstract_text", code: "REQUIRED", message: "Abstract text is required." });
  if (!metadata.keywords || metadata.keywords.trim().length === 0) {
    errors.push({ field: "keywords", code: "REQUIRED", message: "Keywords are required." });
  }
  if (!metadata.mainReferenceSource) {
    errors.push({ field: "main_reference_source", code: "REQUIRED", message: "Main reference source is required." });
  }

  const phoneCheck = normalizePhone(metadata.authorContactPhone) ?? { valid: true, normalized: null };
  if (metadata.authorContactPhone && !phoneCheck.valid) {
    errors.push({ field: "author_contact_phone", code: "INVALID_PHONE", message: "Phone must normalize to 7-15 digits." });
  }

  return {
    errors,
    normalizedPhone: phoneCheck.valid ? phoneCheck.normalized : null
  };
}
